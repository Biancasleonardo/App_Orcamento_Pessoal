class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    // Validação de dados
    validarDados(){
        for (let i in this){
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class Bd{
    // cria o id quando não existe uma informação de ID
    constructor(){
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }
    // verifica o Id
    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }
    // grava os dados em Json no banco de dados
    gravar(d) {
        // atribui o valor de getProximoId a id
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        // seta o valor contido em id no banco de dados
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){
        // array das despesas
        let despesas = Array()

        // recupera o id atual
        let id = localStorage.getItem('id')

        // recupera todas as despesas cadastradas em localStorage
        for (let i = 1; i <= id; i++) {
            
            // recupera a despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            // verifica se existe indices null ou apagados
            if (despesa === null) {
                continue
            }

            // inclui a despesa no array de despesas
            despesas.push(despesa)
            
        }

        return despesas
    }
}

let bd = new Bd()

function cadastrarDespesa() {
    
    // recebe as variáveis 
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')


    // cria o objeto e recupera o valor das variáveis
    let despesa = new Despesa(
        ano.value, 
        mes.value, 
        dia.value, 
        tipo.value, 
        descricao.value, 
        valor.value
    )
    
    if(despesa.validarDados()){
        // chama a função gravar passando como parâmetro os valores de despesa
        bd.gravar(despesa)  

        
        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso!'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'

        document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'

        document.getElementById('modal_botao').innerHTML = 'Voltar'
        document.getElementById('modal_botao').className = 'btn btn-success'

        $('#modalRegistraDespesa').modal('show')

        // Limpa os campos após ser gravado no bd
        dia.value = ''
        mes.value = ''
        ano.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

    } else {

        
        document.getElementById('modal_titulo').innerHTML = 'Despesa não registrada!'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'

        document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos as informações foram preenchidas!'

        document.getElementById('modal_botao').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_botao').className = 'btn btn-danger'
        

        // dialog de erro
        $('#modalRegistraDespesa').modal('show')
    }
      
}

function carregaListaDespesas() {
    let despesas = Array()

    despesas = bd.recuperarTodosRegistros()

    // passa as informações de desepesa para a tela
    var listaDespesas = document.getElementById('listaDespesas')

    // percorrer o array despesas, listando cada despesa de forma dinâmica
    despesas.forEach(function(d){

        // criando a linha (tr)
        let linha = listaDespesas.insertRow()

        // criar as colunas
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        
        // ajutar o tipo
        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break;
            case '2': d.tipo = 'Educação'
                break;
            case '3': d.tipo = 'Lazer'
                break;
            case '4': d.tipo = 'Saúde'
                break;
            case '5': d.tipo = 'Transporte'
                break;
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor
    })
}

