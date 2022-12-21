import pandas as pd


def main():
    df1 = pd.read_csv(
        "C:\TUDelft\Data Visualization\WorldPandemics\\tetanus_world_from_1980.csv")

    df2 = pd.read_csv(
        "C:\TUDelft\Data Visualization\WorldPandemics\\tetanus_ecuador_from_1980.csv")

    df3 = pd.read_csv(
        "C:\TUDelft\Data Visualization\WorldPandemics\\tetanus_ethiopia_from_1980.csv")

    df4 = pd.read_csv(
        "C:\TUDelft\Data Visualization\WorldPandemics\\tetanus_hungary_from_1980.csv")

    df5 = pd.read_csv(
        "C:\TUDelft\Data Visualization\WorldPandemics\\tetanus_myanmar_from_1980.csv")

    df6 = pd.read_csv(
        "C:\TUDelft\Data Visualization\WorldPandemics\\tetanus_syria_from_1980.csv")

    df7 = pd.read_csv(
        "C:\TUDelft\Data Visualization\WorldPandemics\\tetanus_united_states_from_1980.csv")

    df8 = pd.read_csv(
        "C:\TUDelft\Data Visualization\WorldPandemics\\tetanus_China_from_1980.csv")

    df1['Ecuador_cases'] = df2['Ecuador_cases']
    df1['Ecuador_vaccinated'] = df2['Ecuador_vaccinated']

    df1['Ethiopia_cases'] = df3['Ethiopia_cases']
    df1['Ethiopia_vaccinated'] = df3['Ethiopia_vaccinated']

    df1['Hungary_cases'] = df4['Hungary_cases']
    df1['Hungary_vaccinated'] = df4['Hungary_vaccinated']

    df1['Myanmar_cases'] = df5['Myanmar_cases']
    df1['Myanmar_vaccinated'] = df5['Myanmar_vaccinated']

    df1['Syria_cases'] = df6['Syria_cases']
    df1['Syria_vaccinated'] = df6['Syria_vaccinated']

    df1['United_States_cases'] = df7['United_States_cases']
    df1['United_States_vaccinated'] = df7['United_States_vaccinated']

    df1['China_cases'] = df8['China_cases']
    df1['China_vaccinated'] = df8['China_vaccinated']

    print(df1)
    df1.to_csv("tetanus_from_1990_6_countries.csv", index=False)

    countries = ["China", "Ecuador", "Ethiopia",
                 "Hungary", "Myanmar", "Syria", "United States"]


if __name__ == '__main__':
    main()
