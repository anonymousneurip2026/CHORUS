// Intersection Observer for scroll animations
window.onload = () => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('animate-up');
        });
    }, observerOptions);

    document.querySelectorAll('.animate-up').forEach(el => observer.observe(el));
};

function copyCode(button, elementId) {
    const code = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(code).then(() => {
        const originalText = button.innerText;
        button.innerText = 'Copied!';
        button.classList.add('active');

        setTimeout(() => {
            button.innerText = originalText;
            button.classList.remove('active');
        }, 2000);
    });
}

/**
 * Handles switching between different stages of the forward pass walkthrough.
 * @param {number} stageIndex - The index of the stage to display (0-4).
 */
function switchStage(stageIndex) {
    console.log("Switching to stage:", stageIndex);

    // Update all sidebar cards
    const cards = document.querySelectorAll('.step-card');
    cards.forEach((card, index) => {
        if (index === stageIndex) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });

    // Update all code viewport stages
    const stages = document.querySelectorAll('.code-stage');
    stages.forEach((stage, index) => {
        if (index === stageIndex) {
            stage.style.display = 'block';
            // Add a small delay for the fade-in animation to trigger
            stage.style.opacity = '0';
            setTimeout(() => {
                stage.style.opacity = '1';
                stage.style.transition = 'opacity 0.4s ease-in-out';
            }, 10);
        } else {
            stage.style.display = 'none';
        }
    });
}

/**
 * Interpretability Explorer Logic
 */
let interpretabilityData = {}; // Now loaded dynamically

let currentCohort = 'TCGA-NSCLC';
let currentSubclass = 'LUAD';

function setCohort(cohort) {
    console.log("[TextExplorer] Setting cohort:", cohort);
    currentCohort = cohort;
    currentSubclass = interpretabilityData[cohort][0];

    // Update Text Cohort Buttons specifically
    document.querySelectorAll('.interpret-section .cohort-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === cohort);
    });

    renderSubclassTabs();
    updateInterpretImage();
}

function renderSubclassTabs() {
    const container = document.getElementById('subclass-container');
    if (!container) return;
    container.innerHTML = '';

    interpretabilityData[currentCohort].forEach(sub => {
        const btn = document.createElement('button');
        btn.className = `subclass-btn ${sub === currentSubclass ? 'active' : ''}`;
        btn.innerText = sub;
        btn.onclick = () => setSubclass(sub);
        container.appendChild(btn);
    });
}

function setSubclass(subclass) {
    console.log("Setting subclass:", subclass);
    currentSubclass = subclass;

    // Update Subclass Buttons
    document.querySelectorAll('.subclass-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === subclass);
    });

    updateInterpretImage();
}

function updateInterpretImage() {
    const img = document.getElementById('interpret-img');
    if (!img) return;
    const newSrc = `text_interpretability/${currentCohort}/${currentSubclass}_text.png`;
    console.log("Loading image:", newSrc);

    // Fade out
    img.classList.remove('visible');

    setTimeout(() => {
        img.src = newSrc;
        img.onload = () => {
            img.classList.add('visible');
        };
        // Fallback if image fails to load or takes too long
        img.onerror = () => {
            console.error("Failed to load image:", newSrc);
            img.classList.add('visible'); // Show alt text at least
        };
    }, 150);
}

/**
 * Initialize Text Interpretability Explorer
 */
function initTextExplorer() {
    if (typeof textInterpretabilityManifest !== 'undefined') {
        interpretabilityData = textInterpretabilityManifest;
        
        const cohorts = Object.keys(interpretabilityData);
        if (cohorts.length > 0) {
            currentCohort = cohorts[0];
            currentSubclass = interpretabilityData[currentCohort][0];
            
            // Update Text Cohort Buttons specifically
            document.querySelectorAll('.interpret-section .cohort-btn').forEach(btn => {
                btn.classList.toggle('active', btn.innerText === currentCohort);
            });

            renderSubclassTabs();
            updateInterpretImage();
        }
    } else {
        console.error("[TextExplorer] Manifest variable 'textInterpretabilityManifest' not found.");
    }
}


/**
 * Image Interpretability Explorer Logic
 */
let visualHeatmapData = {}; // Now loaded dynamically

let currentVisualCohort = 'TCGA-NSCLC';
let currentVisualSlide = '';
let currentVisualVariation = 'combined';

function initVisualExplorer() {
    if (typeof visualHeatmapDataManifest !== 'undefined') {
        visualHeatmapData = visualHeatmapDataManifest;
        
        // Use manifest to set initial state
        const cohorts = Object.keys(visualHeatmapData);
        if (cohorts.length > 0) {
            currentVisualCohort = cohorts[0];
            currentVisualSlide = visualHeatmapData[currentVisualCohort][0];
            
            console.log("[VisualExplorer] Initializing with cohort:", currentVisualCohort, "and slide:", currentVisualSlide);
            
            populateSlideSelect();
            updateHeatmapImage();
        }
    } else {
        console.error("[VisualExplorer] Manifest variable 'visualHeatmapDataManifest' not found.");
    }
}

function setVisualCohort(cohort) {
    currentVisualCohort = cohort;
    currentVisualSlide = visualHeatmapData[cohort][0];

    // Update Cohort Buttons
    document.getElementById('v-cohort-nsclc').classList.toggle('active', cohort === 'TCGA-NSCLC');
    document.getElementById('v-cohort-rcc').classList.toggle('active', cohort === 'TCGA-RCC');

    populateSlideSelect();
    updateHeatmapImage();
}

function populateSlideSelect() {
    const select = document.getElementById('slide-select');
    if (!select) return;
    select.innerHTML = '';

    visualHeatmapData[currentVisualCohort].forEach(id => {
        const opt = document.createElement('option');
        opt.value = id;
        opt.innerText = id;
        select.appendChild(opt);
    });
    select.value = currentVisualSlide;
}

function setVisualSlide(slideId) {
    currentVisualSlide = slideId;
    updateHeatmapImage();
}

function setVisualVariation(variation) {
    currentVisualVariation = variation;

    // Update Cards
    document.querySelectorAll('.variation-card').forEach(card => {
        const titleText = card.querySelector('h3').innerText.toLowerCase().replace(' ', '').replace('-', '');
        const targetText = (variation === 'combined' ? 'chorus' : variation.toLowerCase()).replace('_', '');
        card.classList.toggle('active', titleText.includes(targetText));
    });

    updateHeatmapImage();
}

function updateHeatmapImage() {
    const img = document.getElementById('heatmap-img');
    if (!img) return;

    const newSrc = `Visual_Heatmaps/${currentVisualCohort}/${currentVisualSlide}/${currentVisualVariation}/uncertainty.png`;
    console.log("[VisualExplorer] Loading image:", newSrc);

    img.classList.remove('visible');

    // Set onload handler BEFORE setting src to catch cached images
    img.onload = () => {
        img.classList.add('visible');
    };
    
    img.onerror = () => {
        console.error("[VisualExplorer] Failed to load image at:", newSrc);
        img.src = 'https://via.placeholder.com/900x600?text=Heatmap+Not+Available';
        img.classList.add('visible');
    };

    setTimeout(() => {
        img.src = newSrc;
    }, 200);
}

// Global Initialization Update
document.addEventListener('DOMContentLoaded', () => {
    // Text Explorer Init
    if (document.getElementById('subclass-container')) {
        initTextExplorer();
    }

    // Visual Explorer Init
    if (document.getElementById('slide-select')) {
        initVisualExplorer();
    }
});
