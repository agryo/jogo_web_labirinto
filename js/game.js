// Variável "game" recebe um "new" Phaser.Game com as dimensões 750px por 500px e renderização "CANVAS" do Phaser
var game = new Phaser.Game(750,500,Phaser.CANVAS);

    // Aqui estou instanciando todos os códigos que vão ser usados.
    // O "game", a variável que já foi criada, "state.add" adicionando o State com o nome entre aspas simples e o
    // código que foi criado na pasta JS. O nome que será usado no restante do código é esse entre aspas.
    game.state.add('boot',bootState);
    game.state.add('load',loadState);
    game.state.add('menu',menuState);
    game.state.add('stage1',stage1State);
    game.state.add('stage2',stage2State);
    game.state.add('end',endState);

    // Aqui ele inicia o jogo pelo "boot" como já foi falado que agora usa-se o nome que foi instanciado.
    // O "game" inicia o State "boot".
    game.state.start('boot');