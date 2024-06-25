document.getElementById('file-input').addEventListener('change', handleFileSelect, false);
let pdfFileName = '';

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file.type === 'application/pdf') {
        pdfFileName = file.name.replace('.pdf', ''); // Get the PDF file name without extension
        const fileReader = new FileReader();
        fileReader.onload = function() {
            const typedArray = new Uint8Array(this.result);
            pdfjsLib.getDocument(typedArray).promise.then(pdf => {
                const pdfContainer = document.getElementById('pdf-container');
                pdfContainer.innerHTML = '';
                for (let pageNum = 1; pageNum <= 6; pageNum++) {
                    renderPage(pdf, pageNum);
                }
            });
        };
        fileReader.readAsArrayBuffer(file);
    } else {
        alert('Please select a valid PDF file.');
    }
}

function renderPage(pdf, pageNum) {
    pdf.getPage(pageNum).then(page => {
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        page.render(renderContext).promise.then(() => {
            const pdfPageDiv = document.createElement('div');
            pdfPageDiv.className = 'pdf-page';
            pdfPageDiv.appendChild(canvas);
            pdfPageDiv.addEventListener('click', () => downloadPageAsJPEG(canvas, pageNum));
            document.getElementById('pdf-container').appendChild(pdfPageDiv);
        });
    });
}

function downloadPageAsJPEG(canvas, pageNum) {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg');
    link.download = `${pdfFileName}_page_${pageNum}.jpg`;
    link.click();
}

