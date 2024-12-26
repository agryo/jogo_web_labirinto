// Variável "game" recebe um "new" Phaser.Game com as dimensões 750px por 500px e renderização "CANVAS" do Phaser
var game = new Phaser.Game(750,500,Phaser.AUTO);

    // Aqui cria a variável global para armazenar a pontuação dos jogadores e será um Objeto.
    // Os itens do Objeto serão a pontuação do jogo "score" e a melhor pontuação geral "recorde".
    // Criando aqui ela poderá ser acessada por todas as "State" do jogo.
    game.global = {
        score: 0,
        record: 0
    };

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

/*
  Função Global para gerar o Objeto das configurações da Fase.
  A função recebe a quantidade de moedas para passar de fase, depois o tempo da fase e o fator de bonus da fase.
  E retorna o Objeto pronto para a fase a ser usado.
*/
function configFase (moedas, tempo, fator) {
    stageConfig = {
        onGame: true,
        moedasFase: moedas,
        tempoFase: tempo,
        fatorBonus: fator
    }
    return stageConfig;
}

/*
  Função Fim de Jogo (Game Over)
  Atualiza a variável que finaliza o Jogo.
*/
function gameOver () {
    // Quando o jogo acaba, por tempo ou conclusão, o jogo acaba. A variável "this.stageConfig.onGame" recebe "false".
    stageConfig.onGame = false;
}

/*
  Função para Parar o Jogador
  Essa função para o jogador e vira ele para a camera quando termina a fase.
*/
function pararPlayer (player) {
    // Agora para o personagem no Eixo X e Eixo Y.
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    // Para a animação do personagem.
    player.animations.stop();
    // E para o personagem na primeira imagem que ele está virado para a tela do jogador.
    player.frame = 0;
}

/*
  Função para Parar o Inimigo
  Essa função para o inimigo e vira ele para a camera quando termina a fase.
  Parametros: O inimigo que deve ser parado. Caso tenha mais de um, adiciona duas vezes individualmente.
*/
function pararInimigo (inimigo) {
    // Para o Inimigo também. O inimigo já para nois eixos pois a função dele está dentro do "Update".
    inimigo.animations.stop();
    inimigo.frame = 0;
}

/*
  Função para Parar a Moeda
  Essa função para a moeda e vira ela para a camera quando termina a fase.
*/
function pararMoeda (moeda) {
    // Para a animação das moedas.
    moeda.animations.stop();
    moeda.frame = 4;
}

/*
  Função que gera os textos do jogo
  Ela irá receber um valor, da contagem por exemplo, e vai verificar quantos digitos tem, pois vão ter sempre 3 digitos.
  Ao verificar quantos digitos tem, ela irá preencher o restante com zeros até ficar com 3 digitos.
*/
function getText (valor) {
    // Se o valor for menor que "10"
    if (valor < 10) {
        // Retorna dois zeros mais o valor atual.
        return '00' + valor.toString();
    }
    // Se o valor for menor que "10"
    if (valor < 100) {
        // Retorna um zero mais o valor atual.
        return '0' + valor.toString();
    }
    // Se não for nenhuma dos acima, retorna apenas o valor atual.
    return valor.toString();
}

/*
  Função Adicionar Novo Inimigo
  Essa função cria um novo inimigo para ser adicionado ao jogo.
  Parametros: Eixo X, Eixo Y de onde ele vai iniciar e SpriteKey é a imagem do sprite do inimigo.
*/
function addInimigo (x, y, spriteKey) {
    // Cria o sprite do inimigo.
    var inimigo = game.add.sprite(x, y, spriteKey);
    
    // Centraliza no próprio eixo.
    inimigo.anchor.set(0.5);
    
    // Habilita a física ao inimigo.
    game.physics.arcade.enable(inimigo);
    
    // Adiciona as animações do inimigo.
    inimigo.animations.add("goDown", [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
    inimigo.animations.add("goUp", [8, 9, 10, 11, 12, 13, 14, 15], 12, true);
    inimigo.animations.add("goLeft", [16, 17, 18, 19, 20, 21, 22, 23], 12, true);
    inimigo.animations.add("goRight", [24, 25, 26, 27, 28, 29, 30, 31], 12, true);
    
    // Define a direção inicial.
    inimigo.direction = 'DOWN';
    
    return inimigo;
}

/*
  Função para verificar se o Record foi superado.
  Primeiro ele verifica SE a pontuação atual é maior que o Record.
  Se for verdade, ele atualiza o Record com a pontuação atual.
*/
function verificaRecord () {
    if (game.global.score > game.global.record) {
        game.global.record = game.global.score;
    }
}

/*
  Função Nova Posição das Moedas
  A variável "pos" recebe o Array "this.coinPosition" na posição arredondada para baixo "[Math.floor()]"
  E nos parenteses do arredondamento, gera um número aleatório "Math.random()" multiplicado pelo tamanho do Array.
  Sorteando uma nova posição para a moeda aparecer.
*/
function newPosition (position) {
    // Sorteia a nova posição para a variável.
    var pos = position[Math.floor(Math.random() * position.length)];

    // Enquanto a posição sorteada for igual a posição nova, para não ser a mesma.
    while (position === pos) {
        // Sorteia novamente outra posição até que seja diferente.
        pos = position[Math.floor(Math.random() * position.length)];
    }
    // Quando tiver uma nova posição válida, retorna ela na função.
    return pos;
}