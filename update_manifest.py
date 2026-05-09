import os
import json

def generate_manifest():
    visual_base = 'Visual_Heatmaps'
    text_base = 'text_interpretability'
    
    manifest = {
        'visual': {},
        'text': {}
    }
    
    # Scan Visual Heatmaps
    if os.path.exists(visual_base):
        for cohort in sorted(os.listdir(visual_base)):
            cohort_path = os.path.join(visual_base, cohort)
            if os.path.isdir(cohort_path):
                manifest['visual'][cohort] = []
                for slide in sorted(os.listdir(cohort_path)):
                    slide_path = os.path.join(cohort_path, slide)
                    if os.path.isdir(slide_path):
                        manifest['visual'][cohort].append(slide)
    
    # Scan Text Interpretability
    if os.path.exists(text_base):
        for cohort in sorted(os.listdir(text_base)):
            cohort_path = os.path.join(text_base, cohort)
            if os.path.isdir(cohort_path):
                manifest['text'][cohort] = []
                for file in sorted(os.listdir(cohort_path)):
                    if file.endswith('_text.png'):
                        subclass = file.replace('_text.png', '')
                        manifest['text'][cohort].append(subclass)

    with open('visual_heatmap_manifest.js', 'w') as f:
        f.write(f"const chorusManifest = {json.dumps(manifest, indent=4)};\n")
        f.write(f"const visualHeatmapDataManifest = chorusManifest.visual;\n")
        f.write(f"const textInterpretabilityManifest = chorusManifest.text;\n")
    
    print(f"Created visual_heatmap_manifest.js with {len(manifest['visual'])} visual cohorts and {len(manifest['text'])} text cohorts.")

if __name__ == "__main__":
    generate_manifest()
