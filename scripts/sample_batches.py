import os
import numpy as np
import pandas as pd


COLS = {
    'noun': 'noun',
    'predicate': 'state',
}
IGNORE_STATES = ['is-holdable']

def main(fname, task, target_count=1000, page_size=500):
    # Load the CSV file
    df = pd.read_csv(fname).drop(columns=['Unnamed: 0'])
    column = COLS[task]
    if task == 'predicate':
        df = df[~df['state'].isin(IGNORE_STATES)]
    df.insert(0, 'batchId', np.arange(len(df)))

    # Print the value counts
    print(f"Starting with {len(df)} {task} batches")
    print(df[column].value_counts())

    assert len(df) >= target_count, f"trying to sample {target_count} batches from {len(df)} {task} batches?"
    frac = target_count / len(df)
    print(f"Sampling {frac} of {task} batches by {column} to get {target_count}")

    # Sample batches
    df = df.groupby(column).apply(lambda x: x.sample(frac=frac)).reset_index(drop=True)
    df = df.sample(min(len(df), target_count))
    df = df.sort_values([column])

    # Print the value counts
    print(f"Sampled {len(df)} {task} batches")
    print(df[column].value_counts())

    for i in range(0, len(df), page_size):
        df[i:i+page_size].to_csv(f'{os.path.dirname(fname)}/{task}_sampled_{i}.csv', index=False)

    # Save the sampled CSV file
    df.to_csv(f'{os.path.dirname(fname)}/{task}_sampled.csv', index=False)


if __name__ == '__main__':
    import fire
    fire.Fire(main)