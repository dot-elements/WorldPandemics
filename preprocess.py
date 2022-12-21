import pandas as pd


def main():
    df1 = pd.read_csv(
        "C:\\TUDelft\\Data Visualization\\WorldPandemics\\assets\\data\\tetanus-cases-vs-tetanus-vaccination-coverage.csv")
    # df2 = pd.read_csv(
    #     "C:\TUDelft\Data Visualization\WorldPandemics\\tetanus_world_only")
    countries = ["China", "Ecuador", "Ethiopia",
                 "Hungary", "Myanmar", "Syria", "United States"]
    # df1 = df1[df1.Entity.isin(countries)]
    df1 = df1[df1.Entity == "United States"]
    df1 = df1[df1.year >= 1990]
    df1 = df1[df1.year <= 2019]

    # df1 = df1[df1.year > 1990]

    # df1 = df1.drop('Population (historical estimates)', axis=1)
    df1 = df1.drop('Code', axis=1)
    df1 = df1.drop('Entity', axis=1)
    df1 = df1.drop('Continent', axis=1)
    # df1 = df1.drop('year', axis=1)
    df1["percentage_vaccinated"] = df1["percentage_vaccinated"].div(
        100).round(2)
    df1.rename(columns={'cases': 'United_States_cases',
               'percentage_vaccinated': 'United_States_vaccinated'}, inplace=True)
    # df1 = df1.drop('Entity', axis=1)
    # df1 = df1.drop('Continent', axis=1)
    df1.to_csv("tetanus_united_states_from_1980.csv", index=False)
    # df1 = df1.dropna()
    # print(df1[df1.isnull().any(axis=1)])
    print(df1)


if __name__ == '__main__':
    main()
