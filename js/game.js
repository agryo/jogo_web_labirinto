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

/*
  Função de Movimentação do Inimigo
  Primeiro verifica se o inimigo está no centro da célula.
  Cada célula tem 50px de largura e 50px de altura.
*/
function moveInimigo (mapaFase, inimigo) {
  // Se o Eixo X do inimigo menos "25" dividido por "50" obtiver resto "0" e "&&" mesma coisa no Eixo Y.
  if (Math.floor(inimigo.x -25) %50 === 0 && Math.floor(inimigo.y -25) %50 === 0) {
      // Cria as variáveis de coordenadas do inimigo em linha e coluna.
      var colInimigo = Math.floor(inimigo.x / 50);
      var rowInimigo = Math.floor(inimigo.y / 50);
      // Cria uma Array de possíveis direções a serem seguidas, para o inimigo.
      var validPath = [];

      /*
        Verifica ao redor do inimigo para onde ele pode ir.
        Se no mapa na mesma linha do inimigo e coluna menos "1" for diferente de "1" no mapa e "&&"
        o movimento atual do inimigo for diferente de direita "RIGHT" entra no primeiro "IF".
        A segunda condição da movimentação é para evitar que ele fique indo e voltando sem sair do lugar.
        Que é para mover para a esquerda.
      */
      if (mapaFase[rowInimigo][colInimigo - 1] !== 1 && inimigo.direction !== 'RIGHT') {
          // Adiciona um caminho válido ao "validPath".
          validPath.push('LEFT');
      }
      // Mesma lógica para o restante das direções possíveis.
      if (mapaFase[rowInimigo][colInimigo + 1] !== 1 && inimigo.direction !== 'LEFT') {
          validPath.push('RIGHT');
      }
      if (mapaFase[rowInimigo - 1][colInimigo] !== 1 && inimigo.direction !== 'DOWN') {
          validPath.push('UP');
      }
      if (mapaFase[rowInimigo + 1][colInimigo] !== 1 && inimigo.direction !== 'UP') {
          validPath.push('DOWN');
      }
    
      // Com todos as possíveis direções registradas, sorteia uma direção para o inimigo ir.
      inimigo.direction = validPath[Math.floor(Math.random() * validPath.length)];
  }

  // Movimenta o inimigo na direção sorteada.
  switch (inimigo.direction) {
      case 'LEFT':
          inimigo.x -= 1;
          inimigo.animations.play('goLeft');
          break;
      case 'RIGHT':
          inimigo.x += 1;
          inimigo.animations.play('goRight');
          break;
      case 'UP':
          inimigo.y -= 1;
          inimigo.animations.play('goUp');
          break;
      case 'DOWN':
          inimigo.y += 1;
          inimigo.animations.play('goDown');
          break;
  }
}

/*
  Criação do emissor das partículas da explosão
  Aqui a variável "emitter" recebe o emissor ".emitter()"  e adiciona ".add" ao jogo "game".
  Parametros -> "( )": Eixo X, Eixo Y e Quantidade máxima de partículas.
*/
function geraParcicula () {
  emitter = game.add.emitter(0, 0, 15);
  // Adiciona a imagem a ser usada nas partículas.
  emitter.makeParticles('part');
  // Configura a valocidade das partículas nos Eixos X e Y. De "-50" ate "50" de velocidade, dentro da célula.
  emitter.setXSpeed(-50, 50);
  emitter.setYSpeed(-50, 50);
  // E configura para elas não serem afetadas pela gravidade.
  emitter.gravity.y = 0; 
  // Retorna a partícula pronta.
  return emitter;
}

/*
  Função de Movimento
  Essa é a função que captura as entradas do teclado para movimentar o jogador.
  Eixo X se move na horizontal, direita e esquerda
  Eixo Y se move na vertical, para cima e para baixo.
*/
function movePlayer (controle, jogador) {
  // Inicia o jogador parado
  jogador.body.velocity.x = 0;
  jogador.body.velocity.y = 0;

  // Se o "controle" seta esquerda "left" estiver pressionada "isDown" e (&&) da direita não ("!" negação).
  if (controle.left.isDown && !controle.right.isDown) {
    // O jogador "jogador" move o corpo ".body" na velocidade ".velocity" do Eixo X ".x" a velocidade "-100".
    jogador.body.velocity.x = -100; // Número negativo "-" esquerda
    // Criar a subfunção de direção que não existe para adicionar as direções "direction".
    jogador.direction = "left";
  }
  // Se o "controle" seta direita "right" estiver pressionada "isDown" e (&&) da esqueda não ("!" negação).
  else if (controle.right.isDown && !controle.left.isDown) {
    // O jogador "jogador" move o corpo ".body" na velocidade ".velocity" do Eixo X ".x" a velocidade "100".
    jogador.body.velocity.x = 100; // Número positivo direita
    // Criar a subfunção de direção que não existe para adicionar as direções "direction".
    jogador.direction = "right";
  }

  // Se o "controle" seta cima "up" estiver pressionada "isDown" e (&&) da baixo não ("!" negação).
  if (controle.up.isDown && !controle.down.isDown) {
    // O jogador "jogador" move o corpo ".body" na velocidade ".velocity" do Eixo Y ".y" a velocidade "-100".
    jogador.body.velocity.y = -100; // Número negativo "-" cima
    // Criar a subfunção de direção que não existe para adicionar as direções "direction".
    jogador.direction = "up";
  }
  // Se o "controle" seta baixo "left" estiver pressionada "isDown" e (&&) da cima não ("!" negação).
  else if (controle.down.isDown && !controle.up.isDown) {
    // O jogador "jogador" move o corpo ".body" na velocidade ".velocity" do Eixo Y ".y" a velocidade "100".
    jogador.body.velocity.y = 100; // Número positivo baixo
    // Criar a subfunção de direção que não existe para adicionar as direções "direction".
    jogador.direction = "down";
  }

  /*
    Com as direções criadas e capturadas no movimento
    Usa o "Switch" para ativar as animações do personagem
    Seleciona no "switch" a variável criada com as direções "jogador.direction".
    E cria todos os casos com as animações ativadas.
    Dê o play ".play" na Animação ".animations" do Personagem "jogador".
    Entre os parenteses qual a animação será usada com as IDs criadas na animação.
  */
  switch (jogador.direction) {
    case "left":
      jogador.animations.play("goLeft"); break;
    case "right":
      jogador.animations.play("goRight"); break;
    case "up":
      jogador.animations.play("goUp"); break;
    case "down":
      jogador.animations.play("goDown"); break;
  }

  /* 
    Aqui é para parar a animação quando o personagem estiver parado.
    Se "if" no Eixo X ".x" a Velocidade ".velocity" do Corpo ".body" do Personagem "jogador" for igual a "0"
    E "&&" no Eixo Y ".y" a Velocidade ".velocity" do Corpo ".body" do Personagem "jogador" for igual a "0"
  */
  if (jogador.body.velocity.x === 0 && jogador.body.velocity.y === 0) {
    // Pare ".stop()" a Animação ".animations" do personagem "jogador".
    jogador.animations.stop();
  }
}

/*
  Iniciar a música do jogo.
  Variável Global "music" do "manuState" usando o "this" para isso.
*/
function adicionarMusica (idMusica) {
  const music = game.add.audio(idMusica);
  // Informa que a música vai ficar repetindo em "loop"
  music.loop = true;
  // Informa a altura do som da música do menu será de 50%.
  music.volume = .5;
  // Inicia a música após as configurações.
  music.play();
  // Retorna a música pronta pra fase do jogo e já iniciada.
  return music;
}

/*
  Carrega os sons do jogo.
  Adiciona os sons de interação do jogo.
*/
function addSons(idSom) {
  som = game.add.audio(idSom);
  som.volume = .5;
  // Retorna o som preparado para a fase do jogo.
  return som;
}

/*
  Função para criar os Blocos.
  Essa função cria o grupo dos blocos que serão usado para preencher o mapa.
*/
function addBlocos() {
  // Aqui a variável "blocks" vai receber um "group" do Phaser para ser o grupo dos blocos.
  var blocks = game.add.group();
  // Agora ativa o corpo físico dos blocos para serem colididos.
  blocks.enableBody = true;
  // Retorna o bloco pronto para usar.
  return blocks;
}

/*
  Função de criar o Jogador.
  A função recebe as coordenadas X e Y para ele ser criado e a ID da Imagem do player carregada no "load.js".
*/
function adicionarPlayer (x, y, idPlayer) {
  // A variável "jogador" recebe o sprite do jogador. O "X" e "Y" somam "+ 25" para ficar no centro.
  var jogador = game.add.sprite(x + 25, y + 25, idPlayer);
  // E centraliza no próprio eixo.
  jogador.anchor.set(0.5);
  // Ativa a movimentação do jogador já carregada no "load"
  game.physics.arcade.enable(jogador);
  /*
    Criar a animação do personagem movimentando para todas as direções.
    Adicione ".add" as Animações ".animations" ao Personagem "this.player"
    Entre os parenteses são a ID "goDown", Array das Imagens, Velocidade e Loop ativo "true".
  */
  jogador.animations.add("goDown", [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
  jogador.animations.add("goUp", [8, 9, 10, 11, 12, 13, 14, 15], 12, true);
  jogador.animations.add("goLeft", [16, 17, 18, 19, 20, 21, 22, 23], 12, true);
  jogador.animations.add("goRight", [24, 25, 26, 27, 28, 29, 30, 31], 12, true); 

  // Retorna o jogador pronto para a fase do jogo.
  return jogador;
}

/*
  Função de montar a fase do jogo.
  Parametros: Mada da Fase, ID da imagem da parede, Grupo de Blocos da Fase, Possíveis Posições das Moedas e o Jogador.
*/
function montarFase(mapa, idBlock, blocos, positionCoin, jogador) {
  /*
  O "FOR" vai percorrer a matriz para detectar os números para em seguida montar o mapa.
  Primeiro ele percorre as linhas "row" no mapa "this.mapa".
  Depois ele percorre as colunas "col" na linha do mapa "this.mapa[row]".
  Durante a detecção ele cria a variável "tile" que recebe a linha e coluna do mapa.
  Cria as variáveis de "X" e "Y" para informar o tamanho dos blocos que serão 50px (multiplica por 50).
  E finalmente monta o mapa com o "IF" onde se o "tile" for igual a "1" o "block" recebe os dados.
  */
  for (var row in mapa) {
    for (var col in mapa[row]) {
      var tile = mapa[row][col];

      var x = col * 50;
      var y = row * 50;

      // Primeiro adiciona os Blocos nos casos iguais a "1"
      if (tile === 1) {
        var block = blocos.create(x, y, idBlock);
        // Após criar o bloco, informa que o corpo ".body" dele não pode se mover ".immovable" como "true".
        block.body.immovable = true;
      }
      // Depois adiciona o Jogador caso seja igual a "2"
      else if (tile === 2) {
        // A variável "player" recebe o sprite do jogador. O "X" e "Y" somam "+ 25" para ficar no centro.
        jogador.x = x + 25;
        jogador.y = y + 25;
      }
      // Depois adiciona as possíveis posições onde as moedas irão aparecer caso seja igual a "3".
      else if (tile === 3) {
          // Váriável que receberá um objeto com as coordenadas das posições em X e Y.
          var position = {
              // X e Y "+ 25" pois são o centro da célula.
              x: x + 25,
              y: y + 25
          };
          // Em seguida adiciona as posiçõoes ao Array criado mais acima.
          positionCoin.push(position);
      }
    }
  }
}

/*
  Criar as Moedas no Jogo
  Primeira cria o Objeto das Moedas.
  Depois adiciona a nova posição no item do objeto ".position" da moeda recebendo a função criada "newPosition()".
*/
function criarMoeda (coinPositions){
  var coin = {};
  coin.position = newPosition(coinPositions);
  // Adiciona a moeda ao jogo recebendo a posição em X, posição em Y e a imagem da moeda "coin".
  coin = game.add.sprite(coin.position.x, coin.position.y, 'coin');
  // Centraliza no próprio eixo
  coin.anchor.set(.5);
  /* 
    Adiciona a animação da moeda.
    Adicione ".add" a Animação ".animations" à Moeda "this.coin" e inicie a reprodução ".play()".
    Entre os parenteses são a ID "spin", o Array de cada imagem (recortes), a velocidade "10" e ativar Loop "true".
  */
  coin.animations.add('spin', [0,1,2,3,4,5,6,7,8,9], 10, true).play();
  // Adionar a física a moeda para ela ser pegável, colidida.
  game.physics.arcade.enable(coin);
  return coin;
}

/*
  Contador de moedas
  Primeiro cria a variável que irá exibir o texto das moedas no jogo.
  Recebendo o texto ".text" adiciona ".add" ao jogo "game".
  Entre os parenteses os parametros, Eixo X, Eixo Y, Texto concatenado a variável "moedas" e estilo da fonte.
*/
function contarMoedas(moedas) {
  var txtMoedas = game.add.text(
    15, 
    15, 
    'MOEDAS: ' + getText(moedas), 
    {font: '15px emulogic', fill: '#fff'}
  );

  // Retorna o texto das moedas para exibir.
  return txtMoedas;
}

/*
  Contador da pontuação
  Primeiro cria a variável que vai receber os pontos.
  E recebe a função do contator de pontos.
*/
function contadorPontos() {
  var txtPontos = game.add.text(
    game.world.centerX, 
    15, 
    'PONTOS: ' + getText(game.global.score), 
    {font:'15px emulogic', fill:'#fff'}
  );
  txtPontos.anchor.set(.5, 0);

  // Retorna o texto para exibir.
  return txtPontos;
}

/*
  Criação do tempo, temporizador do jogo
  Cria a variável que mostra o texto do tempo no jogo com suas configurações nos parametros.
  Usa a variável que armazena o tempo criada no inicio do código no "getText".
  E centraliza no final da tela.
*/
function contadorTempo(tempo) {
  var txtTempo = game.add.text(
    game.world.width - 15, 
    15, 
    'TEMPO: ' + getText(tempo), 
    {font:'15px emulogic', fill:"#fff"}
  );
  txtTempo.anchor.set(1, 0);

  // Retorna o texto para exibir.
  return txtTempo;
}

/*
  Função do Cronometro da fase.
  Cria a variável "cronometro" que recebe um loop repetido ".loop()" que é um evento ".events" de Tempo ".time" no Jogo "game".
  Parametros -> ( ): Tempo para repetir "1000ms", a Função pra chamar a cada repetição e o contexto "this".
*/
function cronometroFase(txtTempo) {
  var cronometro = game.time.events.loop(1000, function(){
    // Diminui o tempo em 1 segundo
    this.stageConfig.tempoFase--;
    // Atualiza o tempo visualmente no jogo.
    txtTempo.text = 'TEMPO: ' + getText(this.stageConfig.tempoFase);
  }, this);

  // Retorna o texto para exibir.
  return cronometro;
}

/*
  Função que exibe a tela de Fase Concluida.
  Gera todos os textos a serem exibidos ao concluir uma fase.
*/
function levelCompleto(txtPontos) {
  const txtLevelComplete = game.add.text(
    game.world.centerX,
    150,
    'LEVEL COMPLETO!',
    {font:'30px emulogic', fill:'#fff'}
  );
  txtLevelComplete.anchor.set(.5);
  // Aumenta os Pontos de acordo com o tempo. O tempo restante multiplicado por "2" nesse caso.
  const bonus = this.stageConfig.tempoFase * this.stageConfig.fatorBonus;
  // Atualiza os pontos com o acrescimo do Bonus.
  game.global.score += bonus;
  // Atualiza o texto dos pontos.
  txtPontos.text = 'PONTOS: ' + getText(game.global.score);

  // Exibe a pontuação de Bonus.
  const txtBonus = game.add.text(
    game.world.centerX,
    250,
    'BONUS DE TEMPO: ' + getText(bonus),
    {font:'20px emulogic', fill:'#fff'}
  );
  txtBonus.anchor.set(.5);

  // Exibe a pontuação final da fase.
  const txtPontoFinal = game.add.text(
    game.world.centerX,
    300,
    'TOTAL DE PONTOS: ' + getText(game.global.score),
    {font:'20px emulogic', fill:'#fff'}
  );
  txtPontoFinal.anchor.set(.5);

  // Exibe o record.
  mostraRecord();

  return txtLevelComplete;
}

/*
  Função que exibe a Tela de Game Over.
  Essa função gera o texto para ser exibido na tela o Game Over.
  Exibe também o record atual.
*/
function txtGameOver() {
  // Cria a variável "txtGameOver" que recebe o texto ".text" e adiciona ".add" ao jogo "game".
  // Parametros ( ): Eixo X, Eixo Y, Texto e Configuração da Fonte.
  const txtGameOver = game.add.text(game.world.centerX, 250, 'GAME OVER', {font:'30px emulogic', fill:'#fff'});
  // Centraliza no próprio eixo.
  txtGameOver.anchor.set(.5);

  // Exibe o record.
  mostraRecord();

  // Retorna o texto da tela de Game Over.
  return txtGameOver;
}

/*
  Função que exibe o Record na fase.
  Essa função gera o texto para ser exibido na tela da fase o record.
*/
function mostraRecord() {
  // Aqui exibe a melhor pontuação independente se passou de fase ou se perdeu.
  const txtBestScore = this.game.add.text(
    game.world.centerX, 
    375, 
    'MELHOR RESULTADO: ' + getText(game.global.record), 
    {font:'20px emulogic', fill:"#fff"}
  );
  txtBestScore.anchor.set(.5);
  // Retorna o texto do Record.
  return txtBestScore;
}

/*
  Função que verifica se passou de fase ou perdeu.
  Cria o evento que chama novamente o Menu Principal ou Próxima Fase.
  Parametros: Recebe as moedas coletadas na fase, Música da Fase atual, ID da Próxima Fase carregada no "load.js"
*/
function passaOuPerde(moedas, musica, proximaFase) {
  /*
    Primeiro cria um evento que após um tempo chama a função.
    Parametros: Tempo de duração para chamar o evento "5000ms", a Função que executa e o contexto "this".
  */
  game.time.events.add(5000, function() {
    // Para a musica do Stage atual.
    musica.stop();
    // Verifica se passou de fase ou se acabou o tempo.
    if (moedas >= this.stageConfig.moedasFase) {
      // SE atingiu as moedas suficientes, passa de fase.
      game.state.start(proximaFase);
    } else {
      // SE NÃO chama o "Menu"
      game.state.start('menu');
    }
  }, this); 
}