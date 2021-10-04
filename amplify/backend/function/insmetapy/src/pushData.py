from os import error
import boto3
client = boto3.resource('dynamodb')

def pushData(table, batches):
    tableName = client.Table(table)
    for data in range(len(batches)):
        try:
            resp = tableName.update_item(Key={
                "id": data["id"]
            },
                UpdateExpression="set mchg=:mchg ychg=:ychg mcap=:mcap ind=:ind index=:index yhigh=:yhigh ylow=:ylow updatedAt=:updatedAt",
                ExpressionAttributeValues={
                ':mchg': data['mchg'],
                ':ychg': data['ychg'],
                ':mcap': data['mcap'],
                ':ind': data['ind'],
                ':index': data['index'],
                ':yhigh': data['yhigh'],
                ':ylow': data['ylow'],
                ':updatedAt': data['updatedAt']
            })
            print(resp)
        except:
            print(error)
