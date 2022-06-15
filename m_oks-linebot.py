# This Python file uses the following encoding: utf-8
from linebot import LineBotApi
from linebot.models import TextSendMessage
from datetime import date, timedelta
import datetime
import time
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from linebot.models import (MessageEvent, TextMessage, TextSendMessage,
                            TemplateSendMessage, PostbackAction, ButtonsTemplate)
start = time.time()
ACCESS_TOKEN = "eGGVhmC8jvLXn+z198PvoZbbAD4c+kBjDiyUbpz4mg/0xL26bEXbryItpmFZylIEPe4LzXd458Bm6up7DCV1fo784uvoCNocASXhj/UOsjo/4Btpm7x55djkAQe89axcTUwHfHtabh7dw1EOiPVE1gdB04t89/1O/w1cDnyilFU="
Z_ACCESS_TOKEN = "kKayxCJykXgG8If3atdNySbpmQrJGw6zDbcHwABBZSrRnazcieAJZgXsChoWGT4ntuGVSech+vQUhgGC1LHC4ge+CSJlC1H/i/jjo9efaPKJ5YA/2hazoWwQ82Y1+bEvHnM2iQOyKXlX/0DIvURDwAdB04t89/1O/w1cDnyilFU="
A_ACCESS_TOKEN = "paUQsZ6Qtj0/2DfSzVh4+jak5e+JDc1/HmrDL6kYteD+q5c8Gutnw/GoQukb1iLoFIAzdhrcneq236jZ6QfarxRFthpP2thrYYkRGuk2dIHNPzQPlzTXmRifwRuL2u8fF/MZ2oos9eLgOa8dSM3PXAdB04t89/1O/w1cDnyilFU="

B_ACCESS_TOKEN = "eV5ywfsIkUaeKRHz58pn0Pa2XO8TPGzMT6mDGFZOOilZeuC1BFUB80K9r0PD28EjEghfBmKG0JyBEPBoknmVibgmzmU4rZwIStBOL30IRQEedHUcEncn608DUZK5kRI9khZYuOEOIv5PzDlvYh/WigdB04t89/1O/w1cDnyilFU="

C_ACCESS_TOKEN = "X6fvAiZirtWJyn9kwFCuKeL/x9erxabX/357UortAGX1FSqOLFjjTEBCieKWHH4b3GuAiSu5SoiLWQjRmKQ3M8AYT8aC/bO3Ac2f5+zMTtsAxqO6/1tfc1KIQcC4ND/ARj8Co1qsdxd3v4huzVstXgdB04t89/1O/w1cDnyilFU="
#text="【受付中のサービス】\n\n『健康観察』\nhttps://forms.gle/GJ99GgFa55dr5c2W7 \n\n『天気予報』\nhttps://forms.gle/VVkgWjZ6wikyRxCa7 \n\n『列車運行情報』new!\n遅延情報や時刻表などを送信します。\n利用形態が二つあるので、フォーム見てください。\n\nhttps://forms.gle/BtC2BCTB81czLMYH8"
# text="【お知らせ】\n\n学年用公式lineを作りました。\n機能としては、classi健康観察入力システム、天気予報、遅延情報、地震情報、一日の運勢、新型コロナ感染者数、などを配信します。\nLINE登録は完全無償で提供いたします。\n\nhttps://forms.gle/8NGijp9dWmQNrYQf6"
text = "【重要なお知らせ】\n本日より、健康観察のシステムをリニューアルいたしました。\n健康のボタンを押してから、体温を入力する必要があります。\n\n体調不良の場合は、必ずGoogleフォームで回答してください。\n健康な場合は、体温の記入で終わりになります。"
text2 ="【お知らせ】\n月曜日より、体温を記録するタイプの健康観察へ移行します。\nツークリック必要になるので気を付けてください。"


buttons_template_message = TemplateSendMessage(
    alt_text='写真共有承諾',
    template=ButtonsTemplate(
        title="写真共有承諾",
        text='1組のみに共有します。許可いただけない場合は考慮します。',
        actions=[
            PostbackAction(
                label='承諾',
                display_text='承諾',
                data="承諾"
            ),
            PostbackAction(
                label='拒否',
                display_text='拒否',
                data="拒否"
            ),
      
            
        ]
    )
)
token = [A_ACCESS_TOKEN,B_ACCESS_TOKEN,C_ACCESS_TOKEN]

for tt in token:
    LineBotApi(tt).broadcast([TextSendMessage(text = text2),TextMessage(text=text)]) 
print(text)
