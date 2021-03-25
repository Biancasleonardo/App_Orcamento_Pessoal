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

            // recupera o id
            despesa.id = i
            // inclui a despesa no array de despesas
            despesas.push(despesa)
            
        }

        return despesas
    }

    pesquisar(despesa){

        let despesasFiltradas = Array()

        // Recupera todos os registros
        despesasFiltradas = this.recuperarTodosRegistros()

        console.log(despesa)
        console.log(despesasFiltradas)

        // ano
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        
        // mes
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        // dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        // tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        // descricao
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        // valor
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
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

function carregaListaDespesas(despesas = Array(), filtro = false) {

    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }
    

    // passa as informações de desepesa para a tela
    let listaDespesas = document.getElementById('listaDespesas')
    // limpa os dados da tela
    listaDespesas.innerHTML = ''

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
        // criar o botão de exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function () {
            // remover a despesa
            // remove a descrição id_despesa
            let id = this.id.replace('id_despesa_', '')

            bd.remover(id)

            // atualiza a página
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
    })
}

function pesquisarDespesa() {

    // pega a informação

    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    this.carregaListaDespesas(despesas, true)
}
