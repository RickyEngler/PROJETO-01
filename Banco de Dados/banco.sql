CREATE TABLE pessoas (
    nome VARCHAR(255) NOT NULL,
    nomemae VARCHAR(255) NOT NULL, -- Corrigido para evitar espaços no nome da coluna
    sexo ENUM('M', 'F') NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE, -- Adicionado UNIQUE para garantir que e-mails sejam únicos
    rg VARCHAR(20) NOT NULL UNIQUE, -- Adicionado UNIQUE para garantir que RGs sejam únicos
    cpf VARCHAR(14) NOT NULL UNIQUE, -- Adicionado UNIQUE para garantir que CPFs sejam únicos
    nascimento DATE NOT NULL,
    grauinstituicao VARCHAR(50) NOT NULL, -- Definido o tipo de dado e um tamanho padrão
    nacionalidade DEFAULT 'Brasil', -- Definido um valor padrão
    cbo DEFAULT '317210'
    senha VARCHAR(255) NOT NULL,
    PRIMARY KEY (cpf) -- Definido CPF como chave primária, pode ser ajustado conforme necessidade
) DEFAULT CHARSET=utf8;