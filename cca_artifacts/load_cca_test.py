import numpy as np
import os

def test_load_npz(filepath):
    print(f"\n{'='*60}")
    print(f"Testing Artifact: {os.path.basename(filepath)}")
    print(f"{'='*60}")
    
    if not os.path.exists(filepath):
        print(f"Error: File {filepath} not found.")
        return

    # Load data
    data = np.load(filepath, allow_pickle=True)
    
    # Check keys
    required_keys = ['W_list', 'means', 'rho', 'encoders', 'latent_dim']
    for key in required_keys:
        if key not in data:
            print(f"MISSING KEY: {key}")
        else:
            val = data[key]
            if key == 'W_list':
                print(f"  - W_list: {len(val)} matrices, shapes {[m.shape for m in val]}")
            elif key == 'means':
                print(f"  - means: {len(val)} vectors, shapes {[m.shape for m in val]}")
            elif key == 'encoders':
                print(f"  - Encoders: {val}")
            else:
                print(f"  - {key}: {val}")

    # Print rho statistics
    rho = data['rho']
    print(f"\nCanonical Correlation Statistics (rho):")
    print(f"  - Mean Correlation: {np.mean(rho):.4f}")
    print(f"  - Max Correlation:  {np.max(rho):.4f}")
    print(f"  - Min Correlation:  {np.min(rho):.4f}")
    print(f"  - First 10 values: {rho[:10]}")

    print(f"\nSUCCESS: Artifact {os.path.basename(filepath)} is valid.")

if __name__ == "__main__":
    base_dir = "/users/home/dchanda/TCGA_datasets_Processed/UCCA_1/cca_artifacts"
    
    artifacts = [
        "visual_cca_LUNG_20x_256px_0px_overlap.npz",
        "visual_cca_RCC_20x_256px_0px_overlap.npz"
    ]
    
    for art in artifacts:
        full_path = os.path.join(base_dir, art)
        test_load_npz(full_path)
