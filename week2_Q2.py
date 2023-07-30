import json

def year(year):
    if year % 4 == 0:
        if year % 100 == 0:
            if year % 400 == 0:
                return True
            else:
                return False
        else:
            return True
    else:
        return False

data = {"2022":year(2022),"2000":year(2000),"2100":year(2100),
        "2400":year(2400),"2023":year(2023),"2024":year(2024),}
file = 'week_2_data.json'
with open(file, 'w') as obj:
    json.dump(data, obj)