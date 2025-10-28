// Configuration
const CONFIG = {
    WORKER_URL: 'https://mynomad-worker.mynomadcompanion.workers.dev/generate',
    MAX_INTERESTS: 3
};

// Destination data mapping
const DESTINATIONS = {
    'lisbon': 'Lisbon, Portugal',
    'porto': 'Porto, Portugal',
    'barcelona': 'Barcelona, Spain',
    'valencia': 'Valencia, Spain',
    'berlin': 'Berlin, Germany',
    'prague': 'Prague, Czech Republic',
    'tallinn': 'Tallinn, Estonia',
    'budapest': 'Budapest, Hungary',
    'chiang-mai': 'Chiang Mai, Thailand',
    'bangkok': 'Bangkok, Thailand',
    'bali': 'Bali (Canggu/Ubud), Indonesia',
    'ho-chi-minh': 'Ho Chi Minh City, Vietnam',
    'taipei': 'Taipei, Taiwan',
    'tbilisi': 'Tbilisi, Georgia',
    'kuala-lumpur': 'Kuala Lumpur, Malaysia',
    'da-nang': 'Da Nang, Vietnam',
    'mexico-city': 'Mexico City, Mexico',
    'playa-del-carmen': 'Playa del Carmen, Mexico',
    'medellin': 'Medellín, Colombia',
    'buenos-aires': 'Buenos Aires, Argentina',
    'san-jose-cr': 'San José, Costa Rica',
    'florianopolis': 'Florianópolis, Brazil',
    'dubai': 'Dubai, UAE',
    'cape-town': 'Cape Town, South Africa',
    'istanbul': 'Istanbul, Turkey'
};

// DOM Elements
const form = document.getElementById('playbook-form');
const generateBtn = document.getElementById('generate-btn');
const loadingSection = document.getElementById('loading');
const resultsSection = document.getElementById('results');
const playbookContent = document.getElementById('playbook-content');
const downloadBtn = document.getElementById('download-btn');
const copyBtn = document.getElementById('copy-btn');
const newPlaybookBtn = document.getElementById('new-playbook-btn');
const rateLimitMessage = document.getElementById('rate-limit-message');

// State
let currentPlaybook = '';

// Interest checkbox limitation
document.querySelectorAll('input[name="interests"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
        const checkedBoxes = document.querySelectorAll('input[name="interests"]:checked');
        if (checkedBoxes.length > CONFIG.MAX_INTERESTS) {
            e.target.checked = false;
            alert(`Please select a maximum of ${CONFIG.MAX_INTERESTS} interests.`);
        }
    });
});

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        destination: document.getElementById('destination').value,
        duration: document.getElementById('duration').value,
        budget: document.getElementById('budget').value,
        workSituation: document.getElementById('work-situation').value,
        interests: Array.from(document.querySelectorAll('input[name="interests"]:checked'))
            .map(cb => cb.value)
    };

    // Validate interests
    if (formData.interests.length === 0) {
        alert('Please select at least one interest.');
        return;
    }

    // Hide form, show loading
    document.querySelector('.form-section').style.display = 'none';
    document.querySelector('.intro').style.display = 'none';
    loadingSection.style.display = 'block';
    resultsSection.style.display = 'none';

    try {
        // Call Cloudflare Worker
        const response = await fetch(CONFIG.WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate playbook');
        }

        // Store and display playbook
        currentPlaybook = data.playbook;
        playbookContent.textContent = currentPlaybook;

        // Show results
        loadingSection.style.display = 'none';
        resultsSection.style.display = 'block';

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error:', error);
        loadingSection.style.display = 'none';
        document.querySelector('.form-section').style.display = 'block';
        document.querySelector('.intro').style.display = 'block';

        if (error.message.includes('rate limit')) {
            rateLimitMessage.textContent = '⚠️ You\'ve reached your monthly limit of 5 playbooks. Please try again next month.';
            rateLimitMessage.style.display = 'block';
            generateBtn.disabled = true;
        } else {
            alert('Failed to generate playbook. Please try again or check your connection.');
        }
    }
});

// Download button
downloadBtn.addEventListener('click', () => {
    const destination = document.getElementById('destination').value;
    const destinationName = DESTINATIONS[destination].replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const filename = `${destinationName}-playbook.md`;

    const blob = new Blob([currentPlaybook], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Copy to clipboard button
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(currentPlaybook);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    } catch (error) {
        alert('Failed to copy to clipboard. Please try selecting and copying manually.');
    }
});

// New playbook button
newPlaybookBtn.addEventListener('click', () => {
    // Reset form
    form.reset();
    rateLimitMessage.style.display = 'none';
    
    // Show form, hide results
    document.querySelector('.form-section').style.display = 'block';
    document.querySelector('.intro').style.display = 'block';
    resultsSection.style.display = 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
