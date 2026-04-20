import { useState, useRef } from 'react'
import { parseCV, readFileAsText, formatFileSize } from '../utils/cvParser.js'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerURL from 'pdfjs-dist/build/pdf.worker.mjs?url'

try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerURL
} catch (e) {
  // Ignore SSR errors
}

/**
 * @param {{ onParsed: (info: {name: string, email: string, phone: string, fileName: string, hasData: boolean}) => void }} props
 */
export default function CVUploader({ onParsed }) {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [parseResult, setParseResult] = useState(null)
  const inputRef = useRef(null)

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return

    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    const isAllowed =
      allowedTypes.includes(selectedFile.type) ||
      selectedFile.name.endsWith('.pdf') ||
      selectedFile.name.endsWith('.txt') ||
      selectedFile.name.endsWith('.doc') ||
      selectedFile.name.endsWith('.docx')

    if (!isAllowed) {
      alert('Lütfen PDF, TXT, DOC veya DOCX formatında bir dosya yükleyin.')
      return
    }

    setFile(selectedFile)
    setIsParsing(true)
    setParseResult(null)

    try {
      let textContent = ''

      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        // PDFJS ile okuma
        try {
          const arrayBuffer = await selectedFile.arrayBuffer()
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
          
          let fullText = ''
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const textContentObj = await page.getTextContent()
            const pageText = textContentObj.items.map(item => item.str).join(' ')
            fullText += pageText + ' \n'
          }
          textContent = fullText
          console.log('[PDFJS Extracted]', textContent) // DEBUG: çıkarılan metni görelim
        } catch (pdfErr) {
          console.error("PDF.js okuma hatasi:", pdfErr)
          // Fallback
          textContent = await readFileAsText(selectedFile)
        }
      } else {
        // TXT vb.
        textContent = await readFileAsText(selectedFile)
      }

      const parsed = parseCV(textContent)
      setParseResult(parsed)

      onParsed({
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        fileName: selectedFile.name,
        hasData: parsed.hasData,
      })
    } catch (err) {
      console.error('CV parsing error:', err)
      onParsed({ name: '', email: '', phone: '', fileName: selectedFile.name, hasData: false })
    } finally {
      setIsParsing(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFile(dropped)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleInputChange = (e) => {
    const selected = e.target.files[0]
    if (selected) handleFile(selected)
  }

  const removeFile = () => {
    setFile(null)
    setParseResult(null)
    if (inputRef.current) inputRef.current.value = ''
    onParsed({ name: '', email: '', phone: '', fileName: '', hasData: false })
  }

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
            ${isDragging
              ? 'border-accent bg-accent/10 scale-[1.02]'
              : 'border-white/20 bg-white/3 hover:border-accent/50 hover:bg-accent/5'
            }`}
          id="cv-upload-zone"
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
              ${isDragging ? 'bg-accent/20' : 'bg-white/5'}`}>
              <svg className={`w-6 h-6 transition-colors ${isDragging ? 'text-accent' : 'text-gray-400'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium text-sm">
                CV'nizi buraya sürükleyin
              </p>
              <p className="text-gray-400 text-xs mt-1">
                veya dosya seçmek için tıklayın
              </p>
              <p className="text-gray-600 text-xs mt-2">
                PDF, TXT, DOC, DOCX • Maks. 5MB
              </p>
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={handleInputChange}
            className="hidden"
            id="cv-file-input"
          />
        </div>
      ) : (
        /* File Preview */
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{file.name}</p>
              <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Parse Result */}
          {isParsing && (
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <div className="w-3 h-3 border border-accent border-t-transparent rounded-full animate-spin" />
              CV analiz ediliyor...
            </div>
          )}

          {!isParsing && parseResult && (
            <div className={`mt-3 p-3 rounded-lg text-xs ${parseResult.hasData
              ? 'bg-emerald-500/10 border border-emerald-500/30'
              : 'bg-amber-500/10 border border-amber-500/20'}`}>
              {parseResult.hasData ? (
                <div className="space-y-1">
                  <p className="text-emerald-400 font-medium mb-2">
                    ✅ CV'den bilgiler otomatik olarak çıkarıldı:
                  </p>
                  {parseResult.name && (
                    <p className="text-gray-300">👤 {parseResult.name}</p>
                  )}
                  {parseResult.email && (
                    <p className="text-gray-300">📧 {parseResult.email}</p>
                  )}
                  {parseResult.phone && (
                    <p className="text-gray-300">📞 {parseResult.phone}</p>
                  )}
                </div>
              ) : (
                <p className="text-amber-400">
                  ⚠️ CV'den bilgi çıkarılamadı. Lütfen formu manuel doldurun.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
