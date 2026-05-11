import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generateBrochure = (venue) => {
  try {
    const doc = new jsPDF()
  const gold = [200, 169, 126] // #C8A97E
  const dark = [26, 26, 26]    // #1A1A1A

  // Header
  doc.setFillColor(...dark)
  doc.rect(0, 0, 210, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  doc.text('RoyalAisle', 105, 25, { align: 'center' })
  
  doc.setFontSize(10)
  doc.text('PREMIUM VENUE SUMMARY', 105, 33, { align: 'center' })

  // Venue Title
  doc.setTextColor(...dark)
  doc.setFontSize(22)
  doc.text(venue.name, 20, 55)
  
  doc.setDrawColor(...gold)
  doc.setLineWidth(1)
  doc.line(20, 58, 60, 58)

  // Details Table
  const tableData = [
    ['Category', venue.category],
    ['Location', `${venue.location?.city}, ${venue.location?.address || ''}`],
    ['Plus Code', venue.location?.plusCode || 'N/A'],
    ['Max Capacity', `${venue.capacity} Guests`],
    ['Base Price', `INR ${venue.price.toLocaleString()}`],
  ]

  autoTable(doc, {
    startY: 65,
    head: [['Specification', 'Details']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: gold, textColor: 255 },
    margin: { left: 20, right: 20 }
  })

  // Amenities
  const amenities = Object.entries(venue.amenities || {})
    .filter(([, v]) => v)
    .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
    .join(', ')

  const finalY = doc.lastAutoTable?.finalY || 120
  doc.setFontSize(14)
  doc.text('Included Amenities', 20, finalY + 15)
  doc.setFontSize(11)
  doc.setTextColor(80, 80, 80)
  doc.text(amenities || 'Standard amenities included', 20, finalY + 22, { maxWidth: 170 })

  // Footer
  const pageHeight = doc.internal.pageSize.height
  doc.setDrawColor(230, 230, 230)
  doc.line(20, pageHeight - 30, 190, pageHeight - 30)
  
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  doc.text('Generated via RoyalAisle - Your Premium Wedding Partner', 105, pageHeight - 20, { align: 'center' })
  doc.text(`Venue ID: ${venue._id}`, 105, pageHeight - 15, { align: 'center' })

  // Save the PDF
  doc.save(`${venue.name.replace(/\s+/g, '_')}_Brochure.pdf`)
  } catch (err) {
    console.error('PDF Generation failed:', err)
    alert('Failed to generate brochure. Please try again.')
  }
}
