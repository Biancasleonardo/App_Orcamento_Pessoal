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
        alert('Despesa Cadastrada com sucesso')
    } else {
        // dialog de erro
        alert('Dados inválidos')
    }
      
}

