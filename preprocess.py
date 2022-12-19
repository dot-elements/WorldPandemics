import pandas as pd


def main():
    df1 = pd.read_csv(
        "C:\TUDelft\Data Visualization\WorldPandemics\\tetanus_deaths_world_only")
    df2 = pd.read_csv(
        "C:\TUDelft\Data Visualization\WorldPandemics\\tetanus_world_only")

    # df1 = df[df.Entity == "World"]
    # df1 = df[df.Year < 2016]
    # df1 = df[df.Year > 1980]

    df1['percentage_vaccinated'] = df2['percentage_vaccinated']
    # df1 = df1.drop('Code', axis=1)
    # df1 = df1.drop('Entity', axis=1)
    # df1 = df1.drop('Continent', axis=1)
    df1.to_csv("tetanus_world_only_combined", index=False)
    print(df1)


if __name__ == '__main__':
    main()
