
import Paciente from "./Paciente.js";
import PacienteConvenio from "./PacienteConvenio.js";

async function validarCep(cep) {
    const regexCep = /^(\d{8}|\d{5}-\d{3})$/;

    const cepInput = document.getElementById("cep");
    const cidadeInput = document.getElementById("cidade");

    if (!regexCep.test(cep)) {
        alert("Digite um CEP válido");
        cepInput.value = "";
        cidadeInput.value = "";
        return false;
    }

    const cepLimpo = cep.replace("-", "");
    const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;

    try {
        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Erro na requisição");
        }

        const dados = await resposta.json();

        if (dados.erro) {
            alert("CEP não encontrado");
            cepInput.value = "";
            cidadeInput.value = "";
            return false;
        } else {
            cidadeInput.value = `${dados.localidade}/${dados.uf}`;
            return true;
        }
    } catch (error) {
        alert("Erro ao consultar o CEP. Verifique sua conexão.");
        cidadeInput.value = "";
        return false;
    }
}

function adicionarPaciente(cliente) {
    const tabelaBody = document.getElementById("tabela-body");
    const tr = document.createElement("tr");

    const imc = cliente.calcularIMC();
    const classificacao = cliente.definirClassificacao();

    const tipo = cliente.constructor.name === "Paciente"
        ? "Particular"
        : "Convênio";

    const valores = [
        cliente.getNome(),
        tipo,
        cliente.getCidade(),
        Number(cliente.getAltura()).toFixed(2),
        Number(cliente.getPeso()).toFixed(1),
        Number(imc).toFixed(2),
        classificacao
    ];

    valores.forEach(valor => {
        const td = document.createElement("td");
        td.textContent = valor;
        tr.appendChild(td);
    });

    tabelaBody.appendChild(tr);
}

const tipoSelect = document.getElementById("tipo");
const abraDiv = document.querySelector(".abrakadabra");
const crtInput = document.getElementById("carteirinha");

tipoSelect.addEventListener("change", () => {
    if (tipoSelect.value === "Convenio") {
        abraDiv.style.display = "flex";
        crtInput.removeAttribute("disabled");
        crtInput.setAttribute("required", "true");
    } else {
        abraDiv.style.display = "none";
        crtInput.setAttribute("disabled", "true");
        crtInput.removeAttribute("required");
        crtInput.value = "";
    }
});

const cepInput = document.getElementById("cep");

cepInput.addEventListener("blur", async () => {
    const cep = cepInput.value.trim();

    if (cep === "") {
        return;
    }

    await validarCep(cep);
});

const form = document.getElementById("form-paciente");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const clientType = document.getElementById("tipo").value;
    const nome = document.getElementById("nome").value;
    const altura = Number(document.getElementById("altura").value);
    const peso = Number(document.getElementById("peso").value);

    if (!Number.isFinite(altura) || altura <= 0) {
        alert("Informe uma altura válida e positiva");
        return;
    }

    if (!Number.isFinite(peso) || peso <= 0) {
        alert("Informe um peso válido e positivo");
        return;
    }

    if (nome.trim() === "") {
        alert("Informe o nome do paciente");
        return;
    }

    if (
        clientType === "Convenio" &&
        document.getElementById("carteirinha").value.trim() === ""
    ) {
        alert("Informe o número da carteirinha");
        return;
    }

    const cep = document.getElementById("cep").value.trim();
    const validCep = await validarCep(cep);

    if (!validCep) {
        return;
    }

    // Captura a cidade somente depois da consulta ao ViaCEP.
    const cidade = document.getElementById("cidade").value;

    let novoPaciente;

    if (clientType === "Convenio") {
        const carteirinha = document.getElementById("carteirinha").value;

        novoPaciente = new PacienteConvenio(
            nome, altura, peso, cidade, carteirinha
        );
    } else {
        novoPaciente = new Paciente(nome, altura, peso, cidade);
    }

    adicionarPaciente(novoPaciente);

    form.reset();
    document.getElementById("nome").focus();
});

form.addEventListener("reset", () => {
    abraDiv.style.display = "none";
    crtInput.setAttribute("disabled", "true");
    crtInput.removeAttribute("required");
});
