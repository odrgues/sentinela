-- O WhatsApp às vezes esconde o número de quem escreve e manda só um identificador (@lid).
-- O bot guarda esse identificador na conta, para reconhecer a pessoa nas próximas mensagens.
ALTER TABLE usuario ADD COLUMN whatsapp_lid VARCHAR(100) NULL UNIQUE AFTER whatsapp_numero;
