import pandas as pd
import numpy as np
import os

def get_calibration_ids(csv_path, seed=0):
    df = pd.read_csv(csv_path)
    train_ids = df["train"].dropna().astype(str).tolist()
    
    # Reproduce fit_visual_cca.py logic
    rng = np.random.default_rng(seed)
    rng.shuffle(train_ids)
    
    n_hold_slides = max(5, len(train_ids) // 10)
    holdout_ids = train_ids[:n_hold_slides]
    cal_ids = train_ids[n_hold_slides:]
    
    return cal_ids, holdout_ids

if __name__ == "__main__":
    base_split_dir = "splits" # Update this to your local splits path
    
    # LUNG
    lung_csv = os.path.join(base_split_dir, "LUAD_LUSC_16shots_5folds/splits_0.csv")
    lung_cal, lung_hold = get_calibration_ids(lung_csv)
    
    # RCC
    rcc_csv = os.path.join(base_split_dir, "TCGA_RCC_16shots_5folds/splits_0.csv")
    rcc_cal, rcc_hold = get_calibration_ids(rcc_csv)
    
    # Prepare DataFrame
    data = []
    for sid in lung_cal: data.append({"cohort": "TCGA-NSCLC", "usage": "calibration", "slide_id": sid})
    for sid in lung_hold: data.append({"cohort": "TCGA-NSCLC", "usage": "holdout", "slide_id": sid})
    for sid in rcc_cal: data.append({"cohort": "TCGA-RCC", "usage": "calibration", "slide_id": sid})
    for sid in rcc_hold: data.append({"cohort": "TCGA-RCC", "usage": "holdout", "slide_id": sid})
    
    df_out = pd.DataFrame(data)
    out_path = "cca_calibration_slide_ids.csv"
    df_out.to_csv(out_path, index=False)
    print(f"Exported {len(df_out)} slide IDs to {out_path}")
