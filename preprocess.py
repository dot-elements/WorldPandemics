import pandas as pd


def main():
    df = pd.read_csv(
        "C:/TUDelft/Data Visualization/WorldPandemics/assets/data/tetanus-cases-vs-tetanus-vaccination-coverage.csv")

    print(df)


if __name__ == '__main__':
    main()
