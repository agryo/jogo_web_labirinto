var loadState = {
    preload: function(){
        /* Esse "preload" cria a variável da imagem instanciada anteriormente.
           A variável "progressBar" recebe do "game" adicionando "add" um Sprite do jogo que é a imagem
           já carregada no "load".
           Nos parenteses coloca as coordenadas onde a imagem irá ser mostrada, X e Y.
           O "game.world.centerX" faz o calculo do Eixo X para ficar no centro.
           O Eixo Y fica a 250px.
           E por fim qual a imagem foi carregada lá no "load".
        */
        var progressBar = game.add.sprite(game.world.centerX,250,'progressBar');
            /* Aqui está definindo o ponto de ancoragem da imagem no centro dela mesma.
               Eixo X = 0.5 e Eixo y = 0.5 como ambos são no centro, basta colocar apenas ".5".
               "anchor" .set(.5) é igual a .set(0.5,0.5)
            */
            progressBar.anchor.set(.5);
            /* Aqui está informando que a imagem será usada como "Barra de Progresso" o percentual de carregamento.
               O "game"  carrega "load" o Sprite de progresso "setPreloadSprite" usando a imagem "progressBar".
            */
            game.load.setPreloadSprite(progressBar);
    }
};