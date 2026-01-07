import csv
import bpy

def make_empty(name, location, coll_name, disp_size): #string, vector, string of existing coll, float
    empty_obj = bpy.data.objects.new( "empty", None, )
    empty_obj.name = name
    empty_obj.empty_display_size = disp_size
    bpy.data.collections[coll_name].objects.link(empty_obj)
    empty_obj.location = location
    return empty_obj

with open('C:\\Users\\jerem\\Desktop\\MissionControl\\blend-vis\\data_1_100_hz_3_yr.csv', newline='\n') as csvfile:
    reader = csv.reader(csvfile, delimiter = ',', quotechar = '|')
    index = 0
    for row in reader:
        index += 1
        if index % 1000:
            continue
        make_empty(f'sunempty{index}', (float(row[2])/1e7,float(row[3])/1e7,float(row[4])/1e7), 'SunCollection', 0.1)
        make_empty(f'moonempty{index}', (float(row[5])/1e7,float(row[6])/1e7,float(row[7])/1e7), 'MoonCollection', 0.001)
        make_empty(f'earthempty{index}', (float(row[8])/1e7,float(row[9])/1e7,float(row[10])/1e7), 'EarthCollection', 0.01)
