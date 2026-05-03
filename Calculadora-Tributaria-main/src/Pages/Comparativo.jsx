import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Comparativo() {
  const [renda, setRenda] = useState("");
  const [custos, setCustos] = useState("");
  const [erro, setErro] = useState("");
  const [resultado, setResultado] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [profissao, setProfissao] = useState("psicologo");
  const [mostrarEmail, setMostrarEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [mensagemEnvio, setMensagemEnvio] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  useEffect(() => {
    // DESATIVADO TEMPORARIAMENTE PARA VOCÊ TESTAR SEM O BACKEND
    // if (!token) {
    //   navigate("/");
    // }
  }, [token, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRendaChange = (e) => {
    const valor = parseFloat(e.target.value);
    if (valor > 15000) {
      setErro("O valor máximo permitido é R$ 15.000,00");
      setRenda(15000);
    } else {
      setErro("");
      setRenda(e.target.value);
    }
  };

  const calcularPF = (baseBruta) => {
    const deducaoSimplificada = 607.20;
    let base = baseBruta - deducaoSimplificada;
    
    // Se a base for menor que 0 após dedução, zeramos
    if(base < 0) base = 0;
    
    let impostoPF = 0;
    let faixa = "Isento";
    let parcelaDedutivel = 0;

    if (base <= 2428.80) {
      faixa = "Isento";
    } else if (base <= 2826.65) {
      impostoPF = base * 0.075 - 182.16;
      faixa = "7,5%";
      parcelaDedutivel = 182.16;
    } else if (base <= 3751.05) {
      impostoPF = base * 0.15 - 394.16;
      faixa = "15%";
      parcelaDedutivel = 394.16;
    } else if (base <= 4664.68) {
      impostoPF = base * 0.225 - 675.49;
      faixa = "22,5%";
      parcelaDedutivel = 675.49;
    } else {
      impostoPF = base * 0.275 - 908.73;
      faixa = "27,5%";
      parcelaDedutivel = 908.73;
    }

    impostoPF = impostoPF < 0 ? 0 : impostoPF;

    // Aplicar redutor 2026 sobre a renda bruta (antes da dedução)
    let redutor = 0;
    if (baseBruta <= 5000) {
      redutor = Math.min(impostoPF, 312.89);
    } else if (baseBruta <= 7350) {
      redutor = 978.62 - (0.133145 * baseBruta);
    }
    
    redutor = redutor < 0 ? 0 : redutor;
    impostoPF = impostoPF - redutor;
    impostoPF = impostoPF < 0 ? 0 : impostoPF;

    return {
      base: baseBruta,
      baseComDeducao: base,
      faixa,
      parcelaDedutivel,
      redutor,
      imposto: impostoPF
    };
  };

  const calcularComparativo = () => {
    const rendaNum = parseFloat(renda);
    const custosNum = parseFloat(custos) || 0;
    
    if (isNaN(rendaNum)) {
      setResultado("Por favor, insira uma renda válida.");
      return;
    }

    const baseBruta = rendaNum - custosNum;
    const pf = calcularPF(baseBruta);

    let pj = {};

    if (profissao === "psicologo" || profissao === "arquiteto") {
      // Regras PJ Psicologia/Arquitetura (Anexo III)
      const simples = rendaNum * 0.06;
      const salarioMin = 1621;
      let salarioBase = rendaNum * 0.28;
      salarioBase = salarioBase < salarioMin ? salarioMin : salarioBase;
      const inss = salarioBase * 0.11;
      const totalPJ = simples + inss;

      pj = {
        simples,
        salarioBase,
        inssDesconto: inss,
        inssPatronal: 0,
        total: totalPJ,
        anexo: "Anexo III (6%)"
      };
    } else if (profissao === "advogado") {
      // Regras PJ Advocacia (Anexo IV)
      const simples = rendaNum * 0.045; // 4,5%
      const salarioBase = 1621; // Sempre o mínimo
      const inssDesconto = salarioBase * 0.11;
      const inssPatronal = salarioBase * 0.20;
      const totalPJ = simples + inssDesconto + inssPatronal;

      pj = {
        simples,
        salarioBase,
        inssDesconto,
        inssPatronal,
        total: totalPJ,
        anexo: "Anexo IV (4,5%)"
      };
    }

    const diferenca = Math.abs(pj.total - pf.imposto);
    const maisVantajoso = pj.total < pf.imposto ? "Pessoa Jurídica" : "Pessoa Física";

    setResultado({
      pf,
      pj,
      maisVantajoso,
      diferenca
    });

    setMostrarEmail(false);
    setMensagemEnvio("");
  };

  const enviarEmail = () => {
    if (!email.includes("@")) {
      setMensagemEnvio("Por favor, insira um e-mail válido.");
      return;
    }
    setMensagemEnvio(`Resultados enviados para ${email} com sucesso!`);
    setEmail("");
  };

  const gerarPDF = () => {
    window.print();
  };

  return (
    <>
      <div className="print:hidden">
        <Navbar />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-400 via-purple-600 to-purple-900 p-6 print:bg-white print:p-0 print:min-h-0">
        <div
          className={`w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 transition-all duration-[700ms] ease-out delay-[200ms] print:shadow-none print:max-w-full print:p-4 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2
            className={`text-2xl font-bold text-center mb-6 text-gray-800 transition-all duration-[700ms] ease-out delay-[400ms] print:text-black ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            Comparativo Tributário (PF vs PJ) - 2026
          </h2>

          <div className="space-y-4 print:hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`transition-all duration-[700ms] ease-out delay-[600ms] ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Profissão
                </label>
                <select
                  value={profissao}
                  onChange={(e) => setProfissao(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                >
                  <option value="psicologo">Psicólogo(a)</option>
                  <option value="arquiteto">Arquiteto(a)</option>
                  <option value="advogado">Advogado(a)</option>
                </select>
              </div>

              <div
                className={`transition-all duration-[700ms] ease-out delay-[800ms] ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Renda Mensal (R$)
                </label>
                <input
                  type="number"
                  value={renda}
                  onChange={handleRendaChange}
                  max="15000"
                  placeholder="Ex: 5000"
                  className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
                {erro && <p className="text-red-600 text-xs mt-1">{erro}</p>}
              </div>

              <div
                className={`transition-all duration-[700ms] ease-out delay-[800ms] ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Custos Mensais (R$)
                </label>
                <input
                  type="number"
                  value={custos}
                  onChange={(e) => setCustos(e.target.value)}
                  placeholder="Ex: 750"
                  className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            <div
              className={`transition-all duration-[700ms] ease-out delay-[1000ms] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <button
                onClick={calcularComparativo}
                className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                Calcular
              </button>
            </div>
          </div>

          {resultado && typeof resultado === "string" ? (
            <p className="text-red-600 font-medium mt-4 text-center print:hidden">{resultado}</p>
          ) : resultado && (
            <div
              className={`mt-6 bg-gray-50 rounded-xl border border-gray-100 p-6 space-y-6 print:border-none print:p-0 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="hidden print:block mb-6 border-b pb-4">
                <h3 className="text-xl font-bold">Relatório de Simulação Tributária</h3>
                <p><strong>Profissão:</strong> <span className="capitalize">{profissao}</span></p>
                <p><strong>Renda Bruta:</strong> R$ {parseFloat(renda).toFixed(2)}</p>
                <p><strong>Custos Comprovados:</strong> R$ {parseFloat(custos || 0).toFixed(2)}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 print:shadow-none print:border-gray-300 print:border">
                  <h3 className="font-bold text-lg mb-3 text-purple-800 border-b pb-2 print:text-black">Pessoa Física</h3>
                  <div className="space-y-2 text-sm text-gray-700 print:text-black">
                    <p className="flex justify-between"><span>Base de Cálculo (Bruta):</span> <strong>R$ {resultado.pf.base.toFixed(2)}</strong></p>
                    <p className="flex justify-between text-xs text-gray-500"><span>Após dedução padrão (R$ 607,20):</span> <span>R$ {resultado.pf.baseComDeducao.toFixed(2)}</span></p>
                    <p className="flex justify-between"><span>Faixa:</span> <strong>{resultado.pf.faixa}</strong></p>
                    <p className="flex justify-between"><span>Parcela a Deduzir:</span> <strong>R$ {resultado.pf.parcelaDedutivel.toFixed(2)}</strong></p>
                    <p className="flex justify-between"><span>Redutor (Regra 2026):</span> <strong className="text-green-600 print:text-black">- R$ {resultado.pf.redutor.toFixed(2)}</strong></p>
                    <div className="border-t pt-2 mt-2">
                      <p className="flex justify-between text-base font-bold text-red-600 print:text-black"><span>IRRF Devido:</span> <span>R$ {resultado.pf.imposto.toFixed(2)}</span></p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 print:shadow-none print:border-gray-300 print:border">
                  <h3 className="font-bold text-lg mb-3 text-purple-800 border-b pb-2 print:text-black">Pessoa Jurídica</h3>
                  <div className="space-y-2 text-sm text-gray-700 print:text-black">
                    <p className="flex justify-between"><span>Enquadramento:</span> <strong>{resultado.pj.anexo}</strong></p>
                    <p className="flex justify-between"><span>DAS (Simples):</span> <strong>R$ {resultado.pj.simples.toFixed(2)}</strong></p>
                    <p className="flex justify-between"><span>Pró-labore Base:</span> <strong>R$ {resultado.pj.salarioBase.toFixed(2)}</strong></p>
                    <p className="flex justify-between"><span>INSS (Desconto 11%):</span> <strong>R$ {resultado.pj.inssDesconto.toFixed(2)}</strong></p>
                    {resultado.pj.inssPatronal > 0 && (
                      <p className="flex justify-between"><span>INSS (Patronal 20%):</span> <strong>R$ {resultado.pj.inssPatronal.toFixed(2)}</strong></p>
                    )}
                    <div className="border-t pt-2 mt-2">
                      <p className="flex justify-between text-base font-bold text-red-600 print:text-black"><span>Total a Pagar:</span> <span>R$ {resultado.pj.total.toFixed(2)}</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-center print:border-gray-300 print:bg-white print:border">
                <p className="text-xl font-bold text-purple-800 print:text-black">
                  Opção mais vantajosa: <span className="uppercase">{resultado.maisVantajoso}</span>
                </p>
                <p className="text-md text-gray-700 mt-1 print:text-black">
                  Economia mensal estimada de: <span className="font-bold text-green-600 print:text-black">R$ {resultado.diferenca.toFixed(2)}</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t print:hidden">
                <button
                  onClick={gerarPDF}
                  className="flex-1 bg-gray-800 text-white font-semibold py-2 rounded-lg hover:bg-gray-900 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Baixar Relatório (PDF)
                </button>
              </div>

              <div className="mt-5 space-y-4 print:hidden">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3 text-center">
                    Deseja receber os resultados por e-mail?
                  </p>
                  {!mostrarEmail ? (
                    <div className="flex justify-center">
                      <button
                        onClick={() => setMostrarEmail(true)}
                        className="bg-purple-100 text-purple-700 px-6 py-2 rounded-lg hover:bg-purple-200 transition font-medium"
                      >
                        Sim, quero receber
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Seu e-mail"
                          className="flex-1 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                        <button
                          onClick={enviarEmail}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                        >
                          Enviar
                        </button>
                      </div>
                      <button onClick={() => setMostrarEmail(false)} className="text-xs text-gray-500 hover:underline">Cancelar</button>
                      {mensagemEnvio && (
                        <p className="text-sm text-center text-green-600 font-medium mt-1">
                          {mensagemEnvio}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col items-center">
                  <p className="text-sm font-medium text-blue-800 mb-2 text-center">
                    Ainda tem dúvidas sobre a melhor escolha?
                  </p>
                  <p className="text-xs text-blue-600 mb-3 text-center">
                    Entre em contato com o Núcleo de Apoio Contábil e Fiscal (NAF) da Unichristus.
                  </p>
                  <a
                    href="mailto:naf01.dl@unichristus.edu.br?subject=Dúvida%20-%20Calculadora%20Tributária"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Enviar E-mail para o NAF
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}