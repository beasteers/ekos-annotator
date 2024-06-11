import pandas as pd

def load_and_shuffle_df(path):
    df = pd.read_csv(path)
    df = df.groupby('noun').apply(lambda x: x.sample(frac=1)).reset_index(drop=True)
    return df

def create_batches_df(N,df):

    # Prepare new DataFrame
    column_names = ['noun']
    for i in range(1, N+1):
        column_names.append(f'image_{i}_file_name')
        column_names.append(f'image_{i}_polygons')
    new_df = pd.DataFrame(columns=column_names)

    df_noun = df.groupby('noun')

    for name, group in df_noun:
        total_rows = len(group)

        # Populate the new DataFrame
        for start_idx in range(0, total_rows-N, N):
            row_data = {'noun':name}
            for i in range(N):
                if start_idx + i < total_rows:
                    current_row = group.iloc[start_idx + i]
                    row_data[f'image_{i+1}_file_name'] = f"{current_row['narration_id']}_{current_row['frame_id']}.jpg"
                    polys = eval(current_row['polygons'])[0].decode()
                    polys = polys.replace('][', ']@[').split('@')
                    polys = [eval(poly) for poly in polys]
                    polys = [[c[0] for c in p] for poly in polys for p in poly]
                    row_data[f'image_{i+1}_polygons'] = polys
            new_df = pd.concat([new_df, pd.DataFrame([row_data])], ignore_index=True)
    return new_df

def main(path_to_mturk_csv='mturk_noun_data.csv', batch_size = 9):

    df = load_and_shuffle_df(path_to_mturk_csv)

    batches_df = create_batches_df(batch_size,df)

    batches_df.to_csv('mturk_batches.csv')


if __name__ == "__main__":
    import fire
    fire.Fire(main)

'''

Creates a CSV with these columns:

noun_batches.csv
predicate_batches.csv

noun = "door"
predicate = "is open"
image_1_file_name = "{narration_id}_{frame_id}.jpg"
image_2_file_name = "{narration_id}_{frame_id}.jpg"
image_3_file_name = "{narration_id}_{frame_id}.jpg"
image_4_file_name = "{narration_id}_{frame_id}.jpg"
image_5_file_name = "{narration_id}_{frame_id}.jpg"
image_6_file_name = "{narration_id}_{frame_id}.jpg"
image_7_file_name = "{narration_id}_{frame_id}.jpg"
image_8_file_name = "{narration_id}_{frame_id}.jpg"
image_9_file_name = "{narration_id}_{frame_id}.jpg"
image_1_polygons = '[[...],[...]]'
image_2_polygons = '[[...],[...]]'
image_3_polygons = '[[...],[...]]'
image_4_polygons = '[[...],[...]]'
image_5_polygons = '[[...],[...]]'
image_6_polygons = '[[...],[...]]'
image_7_polygons = '[[...],[...]]'
image_8_polygons = '[[...],[...]]'
image_9_polygons = '[[...],[...]]'
'''
