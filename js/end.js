var endState = {
    create: function () {
        // Carrega a imagem do fim de jogo.
        game.add.sprite(0, 0, 'end');

        // Cria o texto para ser mostrado.
        const txtPressEnter = this.game.add.text(
          game.world.centerX, 
          250, 
          'PRESSIONE ENTER', 
          {font:'25px emulogic', fill:"#fff"}
        );
        txtPressEnter.anchor.set(.5);
        // Inicia o texto transparente.
        txtPressEnter.alpha = 0;

        // Adiciona um evento para piscar o texto após um tempo.
        game.time.events.add(3000, function() {
            game.add.tween(txtPressEnter).to({alpha: 1}, 500).to({alpha: 0}, 500).loop().start();
            // Habilita a tecla Enter para ser usada.
            var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            // Chama a Função "backToMenu" ao adicionar uma vez ".addOnce" quando pressionada ".onDown" a tecla "enterKey".
            enterKey.onDown.addOnce(this.backToMenu, this);
        }, this);
    },

    // Função para voltar ao Menu Principal
    backToMenu: function () {
        game.state.start('menu');
    }
};