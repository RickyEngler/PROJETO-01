// VERSÃO FINAL E CORRIGIDA
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA ADICIONAR NOVAS LINHAS DINAMICAMENTE ---
    document.querySelectorAll('.add-row-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const containerId = event.target.dataset.target;
            const container = document.getElementById(containerId);
            if (container) {
                const firstRow = container.querySelector('.form-row');
                const newRow = firstRow.cloneNode(true); // Clona a primeira linha
                newRow.querySelectorAll('input').forEach(input => input.value = ''); // Limpa os valores
                container.appendChild(newRow); // Adiciona a nova linha
            }
        });
    });

    // --- LÓGICA PARA GERAR O PDF AO ENVIAR O FORMULÁRIO ---
    const form = document.getElementById('registro-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Previne que a página recarregue

        try {
            console.log("Iniciando geração de PDF...");

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            let finalY = 0;

            // --- Título e Cabeçalho ---
            doc.setFontSize(18);
            doc.text('Registro de Atividades In Loco', doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' });

            const unidade = document.getElementById('unidade').value;
            const responsavel = document.getElementById('responsavel').value;
            let dataInput = document.getElementById('data').value;
            let dataFormatada = '';
            if (dataInput) {
                const [ano, mes, dia] = dataInput.split('-');
                dataFormatada = `${dia}/${mes}/${ano}`;
            }
            
            doc.setFontSize(11);
            doc.text(`Unidade: ${unidade}`, 14, 35);
            doc.text(`Responsável: ${responsavel}`, 14, 42);
            doc.text(`Data: ${dataFormatada}`, 120, 42);

            // --- Tabela de Registro de Ronda ---
            doc.autoTable({
                startY: 50,
                head: [['Registro de Ronda', 'Informação']],
                body: [
                    ['Ponto Focal (Chegada)', document.getElementById('ponto-focal-chegada').value],
                    ['Horário Chegada', document.getElementById('horario-chegada').value],
                    ['Ponto Focal (Saída)', document.getElementById('ponto-focal-saida').value],
                    ['Horário Saída', document.getElementById('horario-saida').value],
                ],
                theme: 'grid',
                headStyles: { fillColor: [41, 128, 185] }
            });
            finalY = doc.lastAutoTable.finalY;

            // --- Função para extrair dados das seções dinâmicas ---
            const getRowsData = (containerId, fields) => {
                const rows = document.querySelectorAll(`#${containerId} .form-row`);
                const data = [];
                rows.forEach(row => {
                    const rowData = fields.map(field => {
                        const input = row.querySelector(`input[name="${field}"]`);
                        return input ? input.value : '';
                    });
                    if (rowData.some(cell => cell.trim() !== '')) {
                        data.push(rowData);
                    }
                });
                return data;
            };

            // --- Tabela de Prioridades ---
            const prioridadesData = getRowsData('prioridades-container', ['prioridade_descricao', 'prioridade_status', 'prioridade_card', 'prioridade_assinatura']);
            if (prioridadesData.length > 0) {
                doc.autoTable({
                    startY: finalY + 10,
                    head: [['Prioridades - Descrição', 'Status', 'Card', 'Assinatura']],
                    body: prioridadesData,
                    theme: 'striped',
                    headStyles: { fillColor: [44, 62, 80] },
                });
                finalY = doc.lastAutoTable.finalY;
            }

            // --- Tabela de Chamados da Unidade ---
            const chamadosData = getRowsData('chamados-container', ['chamado_glpi', 'chamado_descricao', 'chamado_status', 'chamado_assinatura']);
            if (chamadosData.length > 0) {
                doc.autoTable({
                    startY: finalY + 10,
                    head: [['Chamados - GLPI/JIRA', 'Descrição', 'Status', 'Assinatura']],
                    body: chamadosData,
                    theme: 'striped',
                    headStyles: { fillColor: [44, 62, 80] },
                });
                finalY = doc.lastAutoTable.finalY;
            }
            
            // --- Tabela de Chamados Recebidos ---
            const recebidosData = getRowsData('chamados-recebidos-container', ['recebido_descricao', 'recebido_status', 'recebido_card', 'recebido_assinatura']);
            if (recebidosData.length > 0) {
                doc.autoTable({
                    startY: finalY + 10,
                    head: [['Chamados Recebidos - Descrição', 'Status', 'Card', 'Assinatura']],
                    body: recebidosData,
                    theme: 'striped',
                    headStyles: { fillColor: [44, 62, 80] },
                });
                finalY = doc.lastAutoTable.finalY;
            }

            // --- Tabela de Painéis ---
            const paineisData = getRowsData('paineis-container', ['painel_modelo', 'painel_localizacao', 'painel_status', 'painel_anydesk', 'painel_chamador']);
            if (paineisData.length > 0) {
                doc.autoTable({
                    startY: finalY + 10,
                    head: [['Painel - Modelo', 'Localização', 'Status', 'Anydesk', 'Local Chamador']],
                    body: paineisData,
                    theme: 'striped',
                    headStyles: { fillColor: [44, 62, 80] },
                });
                finalY = doc.lastAutoTable.finalY;
            }
            
            // --- Salvar o PDF ---
            const fileName = `Registro_${unidade.replace(/ /g, '_')}_${dataFormatada.replace(/\//g, '-')}.pdf`;
            doc.save(fileName);
            console.log(`PDF "${fileName}" gerado com sucesso.`);

        } catch (error) {
            console.error("### ERRO AO GERAR O PDF ###");
            console.error("O erro foi:", error);
            alert("Ocorreu um erro ao gerar o PDF. Verifique o console (F12) para ver os detalhes do erro.");
        }
    });
});