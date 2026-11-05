package br.com.sentinela.backend.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

import br.com.sentinela.backend.dto.ClimaResponseDTO;
import br.com.sentinela.backend.model.Alerta;
import br.com.sentinela.backend.model.Cultivo;
import br.com.sentinela.backend.model.Cultura;
import br.com.sentinela.backend.model.Mensagem;
import br.com.sentinela.backend.model.Municipio;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.repository.AlertaRepository;
import br.com.sentinela.backend.repository.CultivoRepository;
import br.com.sentinela.backend.repository.MensagemRepository;
import br.com.sentinela.backend.repository.UsuarioRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

// A conversa do bot: "1" mostra as lavouras numeradas, e o número escolhido traz os avisos e a
// previsão daquela lavoura numa mensagem só.
@ExtendWith(MockitoExtension.class)
class EscolhaDeLavouraNoBotTest {

    private static final String CHAT = "553499990000@s.whatsapp.net";

    @Mock MensagemRepository mensagemRepository;
    @Mock UsuarioRepository usuarioRepository;
    @Mock CultivoRepository cultivoRepository;
    @Mock AlertaRepository alertaRepository;
    @Mock ClimaService climaService;
    @Mock OrientacaoService orientacaoService;
    @Mock AvisosService avisosService;

    @InjectMocks WhatsAppService servico;

    private Usuario usuario;
    private Cultivo feijao;
    private Cultivo milho;

    @BeforeEach
    void preparar() {
        // O envio de verdade acontece em outra thread e falha aqui, o que não importa para o teste.
        ReflectionTestUtils.setField(servico, "evolutionApiUrl", "http://localhost:1");
        ReflectionTestUtils.setField(servico, "evolutionApiKey", "");

        usuario = new Usuario();
        usuario.setId(7L);
        usuario.setNome("Larissa");
        usuario.setWhatsappNumero("+553499990000");

        feijao = lavoura(2L, "Feijão da Serra", "Feijão", 11L, "Uberlândia");
        milho = lavoura(1L, "Milho do Vale", "Milho", 12L, "Araguari");

        lenient().when(usuarioRepository.findAll()).thenReturn(List.of(usuario));
        // Fora de ordem de propósito: a lista tem de numerar sempre pelo id.
        lenient().when(cultivoRepository.findByUsuarioId(7L)).thenReturn(List.of(feijao, milho));
        lenient().when(avisosService.daSemana(any())).thenReturn(List.of());
        lenient().when(climaService.buscarPrevisaoPorMunicipio(anyLong())).thenAnswer(inv -> clima());
    }

    @Test
    void numeroUmMostraAsLavourasNumeradasNaOrdemDoCadastro() {
        String resposta = responder("1", ultimaDoBot("oi"));

        assertTrue(resposta.indexOf("*1 · Milho do Vale*") < resposta.indexOf("*2 · Feijão da Serra*"), resposta);
        assertTrue(resposta.contains(MenuDoBot.ESCOLHA_DA_LAVOURA), resposta);
        assertFalse(resposta.contains("Quer ver mais?"), "o menu de 1 a 3 confundiria com o número da lavoura");
    }

    @Test
    void numeroDaListaTrazAvisosEPrevisaoDaLavouraEscolhida() {
        when(avisosService.daSemana(feijao)).thenReturn(List.of(alerta("critico", "Geada na quarta-feira.")));

        String resposta = responder("2", ultimaDoBot("🌾 *Suas lavouras*\n\n...\n\n" + MenuDoBot.ESCOLHA_DA_LAVOURA));

        assertTrue(resposta.contains("*Feijão da Serra*"), resposta);
        assertTrue(resposta.contains("Geada na quarta-feira."), resposta);
        assertTrue(resposta.contains("Previsão para Uberlândia"), resposta);
        assertFalse(resposta.contains("Araguari"), "só a lavoura escolhida: " + resposta);
    }

    @Test
    void semAvisosDizQueEstaTudoCerto() {
        String resposta = responder("1", ultimaDoBot("🌾 ... " + MenuDoBot.ESCOLHA_DA_LAVOURA));

        assertTrue(resposta.contains("*Milho do Vale*"), resposta);
        assertTrue(resposta.contains("Nenhum aviso"), resposta);
        assertTrue(resposta.contains("Previsão para Araguari"), resposta);
    }

    @Test
    void numeroDepoisDeOutraRespostaContinuaSendoOpcaoDoMenu() {
        String resposta = responder("2", ultimaDoBot("☀️ resposta qualquer\n\n*Quer ver mais?*"));

        assertTrue(resposta.contains("Avisos da semana") || resposta.contains("Tudo certo"), resposta);
        assertFalse(resposta.contains("Previsão para"), resposta);
    }

    @Test
    void listaVelhaNaoPrendeAConversa() {
        Mensagem velha = ultimaDoBot("🌾 ... " + MenuDoBot.ESCOLHA_DA_LAVOURA);
        velha.setRegistradoEm(LocalDateTime.now().minusHours(3));

        String resposta = responder("2", velha);

        assertFalse(resposta.contains("Previsão para"), resposta);
    }

    @Test
    void lavouraQueNaoExisteOrientaEVoltaAoMenu() {
        String resposta = responder("9", ultimaDoBot("🌾 ... " + MenuDoBot.ESCOLHA_DA_LAVOURA));

        assertTrue(resposta.contains("Não achei a lavoura *9*"), resposta);
        assertTrue(resposta.contains("de *1* a *2*"), resposta);
    }

    @Test
    void zeroVoltaAoMenuMesmoNaLista() {
        String resposta = responder("0", ultimaDoBot("🌾 ... " + MenuDoBot.ESCOLHA_DA_LAVOURA));

        assertTrue(resposta.contains("O que você quer ver?"), resposta);
    }

    @Test
    void opcaoTresPerguntaDeQualLavouraEmVezDeMostrarSoAPrimeira() {
        String resposta = responder("3", ultimaDoBot("☀️ ..."));

        assertTrue(resposta.contains("De qual lavoura"), resposta);
        assertTrue(resposta.contains("*1 · Milho do Vale*"), resposta);
        assertTrue(resposta.contains("*2 · Feijão da Serra*"), resposta);
        assertFalse(resposta.contains("Previsão para"), resposta);
    }

    private String responder(String texto, Mensagem ultimaDoBot) {
        when(mensagemRepository.findFirstByUsuarioIdAndDirecaoOrderByIdDesc(eq(7L), eq("enviada")))
                .thenReturn(Optional.of(ultimaDoBot));
        return servico.processarWebhook(CHAT, null, texto).mensagem();
    }

    private static Mensagem ultimaDoBot(String conteudo) {
        Mensagem mensagem = new Mensagem();
        mensagem.setDirecao("enviada");
        mensagem.setConteudo(conteudo);
        mensagem.setRegistradoEm(LocalDateTime.now().minusMinutes(1));
        return mensagem;
    }

    private static Cultivo lavoura(Long id, String apelido, String cultura, Long municipioId, String cidade) {
        Cultura c = new Cultura();
        c.setNome(cultura);
        Municipio m = new Municipio();
        m.setId(municipioId);
        m.setNome(cidade);
        Cultivo cultivo = new Cultivo();
        cultivo.setId(id);
        cultivo.setApelido(apelido);
        cultivo.setCultura(c);
        cultivo.setMunicipio(m);
        cultivo.setStatus("em_andamento");
        return cultivo;
    }

    private static Alerta alerta(String severidade, String mensagem) {
        Alerta a = new Alerta();
        a.setSeveridade(severidade);
        a.setMensagem(mensagem);
        return a;
    }

    private static ClimaResponseDTO clima() {
        LocalDate hoje = LocalDate.now();
        return new ClimaResponseDTO("Cidade", "MG", 15.0, 30.0, 12.0, List.of(
                new ClimaResponseDTO.PrevisaoDiariaDTO(hoje.toString(), 15.0, 30.0, 0.0),
                new ClimaResponseDTO.PrevisaoDiariaDTO(hoje.plusDays(1).toString(), 16.0, 28.0, 12.0)));
    }
}
