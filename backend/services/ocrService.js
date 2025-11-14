import axios from 'axios'

// Placeholder OCR service using Google Vision API
export async function extractTextFromImage(imageBuffer, imageType = 'image/jpeg') {
    try {
        // This is a placeholder - integrate Google Vision API for production
        // For MVP, return mock OCR result

        console.log('OCR placeholder called with image type:', imageType)

        return {
            text: 'Sample extracted text from image. Replace with actual OCR service.',
            confidence: 0.85,
            provider: 'placeholder'
        }
    } catch (err) {
        console.error('OCR error:', err.message)
        throw new Error('Failed to extract text from image')
    }
}

// Alternative: Use AWS Textract
export async function extractTextFromImageAWS(imageBuffer) {
    try {
        // Placeholder for AWS Textract integration
        return {
            text: 'Text extracted via AWS Textract placeholder',
            confidence: 0.90,
            provider: 'aws-textract'
        }
    } catch (err) {
        console.error('AWS Textract error:', err.message)
        throw new Error('Failed to extract text from image (AWS)')
    }
}

// Extract entities from OCR'd text (phone, UPI, email)
export function extractEntities(text) {
    const entities = {
        phones: [],
        emails: [],
        upi: [],
        urls: []
    }

    // Phone pattern (Indian format: 10 digits)
    const phoneRegex = /\b(\+91[-.\s]?)?(\d{10})\b/g
    let match
    while ((match = phoneRegex.exec(text)) !== null) {
        entities.phones.push(match[0])
    }

    // Email pattern
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    while ((match = emailRegex.exec(text)) !== null) {
        entities.emails.push(match[0])
    }

    // UPI pattern
    const upiRegex = /\b[a-zA-Z0-9._-]+@[a-zA-Z]{3,}\b/g
    while ((match = upiRegex.exec(text)) !== null) {
        entities.upi.push(match[0])
    }

    // URL pattern
    const urlRegex = /(https?:\/\/[^\s]+)/g
    while ((match = urlRegex.exec(text)) !== null) {
        entities.urls.push(match[0])
    }

    return entities
}
