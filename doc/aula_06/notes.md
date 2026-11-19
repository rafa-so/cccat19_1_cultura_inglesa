Dependency Inversion Principle: um módulo mais alto nível não deve depender de módulos de baixo nível, ambos devem depender de abstrações. é um princípio de design

Dependency Injection: é um princípio técnico que fala torna capaz um determinado recurso ser injetado em tempo de execução sem que este módulo dependa dele.
é possível usar um construtor, setter, Registry (padrão de projeto) annotation etc


O padrão mediator permite o desacoplamento entre use cases como se fosse uma fila em memória. A ideia é permitir que através de um evento seja chamado um determinado use case.

Domain event -> é um fato que aconteceu, só que no domínio