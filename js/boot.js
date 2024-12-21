/* Métodos fundamentais do Phaser
   1- preload(); = Responsável pelo pre-carregamento de alguma coisa.
   2- create();  = Responsável pela configuração, criação de um State.
   3- update();  = Responsável pelo processamento da lógica do Jogo.
   4- render();  = Usado para fazer ma verificação do código "debug" do Jogo.
*/
var bootState = {
    // Como está trabalhando com Objeto, primeiro diz o nome da função "preload:" e diz que é uma função.
    // Item do objeto "preload" dois pontos e informa que é uma função "funciton(){}"
    preload: function(){
        // O "game" que é o código que foi instanciado com esse nome, "load" carrega, "image" uma imagem.
        // Dentro da função passa o ID (nome) na imagem e o local dela entre aspas simples.
        game.load.image('progressBar','img/progressBar.png');
    },
    // A virgula é obrigatória pois abaixo já é outro item no Objeto, o item "create".

    // O "create" vai ser chamado logo após serem carregados todos os arquivos acima no "preload".
    create: function(){
        // O "game" agora chama o State e inicia (start) o "load"
        game.state.start('load');
    }
};