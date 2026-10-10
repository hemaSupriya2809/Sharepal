import json
data = open('data.js').read().replace('window.PRODUCTS=', '').strip('; \n')
j = json.loads(data)
prods = j['products']
j['products'] = (prods * 3)[:56]
for i in range(56):
    j['products'][i]['id'] = int(str(j['products'][i]['id']) + str(i))
open('data.js', 'w').write('window.PRODUCTS=' + json.dumps(j) + ';')
