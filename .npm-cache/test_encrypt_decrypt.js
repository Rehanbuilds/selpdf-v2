const { PDFDocument, PDFDict, PDFName, PDFArray, PDFNumber, PDFRef } = require('pdf-lib');
const { encryptPDF } = require('@pdfsmaller/pdf-encrypt');
const { decryptPDF } = require('@pdfsmaller/pdf-decrypt');

// Apply monkeypatch
if (PDFDict && !PDFDict.prototype.Pages) {
  console.log('Applying PDFDict.prototype.Pages monkeypatch...');
  PDFDict.prototype.Pages = function() {
    if (!this.has(PDFName.of('Pages'))) return undefined;
    return this.lookup(PDFName.of('Pages'), PDFDict);
  };
}
if (PDFDict && !PDFDict.prototype.Kids) {
  console.log('Applying PDFDict.prototype.Kids monkeypatch...');
  PDFDict.prototype.Kids = function() {
    if (!this.has(PDFName.of('Kids'))) return undefined;
    return this.lookup(PDFName.of('Kids'), PDFArray);
  };
}
if (PDFDict && !PDFDict.prototype.Count) {
  console.log('Applying PDFDict.prototype.Count monkeypatch...');
  PDFDict.prototype.Count = function() {
    if (!this.has(PDFName.of('Count'))) return undefined;
    return this.lookup(PDFName.of('Count'), PDFNumber);
  };
}
if (PDFDict && !PDFDict.prototype.traverse) {
  console.log('Applying PDFDict.prototype.traverse monkeypatch...');
  PDFDict.prototype.traverse = function(visitor) {
    const Kids = this.Kids();
    if (!Kids) return;
    for (let idx = 0, len = Kids.size(); idx < len; idx++) {
      const kidRef = Kids.get(idx);
      if (kidRef instanceof PDFRef) {
        const kid = this.context.lookup(kidRef);
        if (kid) {
          if (typeof kid.traverse === 'function') {
            kid.traverse(visitor);
          } else {
            PDFDict.prototype.traverse.call(kid, visitor);
          }
          visitor(kid, kidRef);
        }
      }
    }
  };
}

async function test() {
  try {
    console.log('1. Creating a simple PDF...');
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([200, 200]);
    const pdfBytes = await pdfDoc.save();
    console.log(`PDF created successfully, size: ${pdfBytes.length} bytes`);

    console.log('2. Encrypting PDF...');
    const encryptedBytes = await encryptPDF(pdfBytes, 'password123');
    console.log(`PDF encrypted successfully, size: ${encryptedBytes.length} bytes`);

    console.log('3. Decrypting PDF...');
    const decryptedBytes = await decryptPDF(encryptedBytes, 'password123');
    console.log(`PDF decrypted successfully, size: ${decryptedBytes.length} bytes`);
  } catch (err) {
    console.error('ERROR OCCURRED:');
    console.error(err.stack || err);
  }
}

test();
