# import library for GUI
import PySimpleGUI as sg
# import filter function from filter.py
from filter import filter
# import refine function from refine.py
from refine import refine

background = '#F0F0F0'
# set the theme options
sg.SetOptions(background_color=background,
    element_background_color=background,
    text_element_background_color=background,
    margins=(30, 30),
    text_color = 'Black',
    input_text_color ='Black',
    button_color = ('Black', 'gainsboro')
    ,element_padding=(0,10))

# All the stuff inside your window.
layout = [  [sg.Text(text='Filtered/Refined message:'),sg.Output(key="refined/filtered")],
            [sg.Text(text='Filtered message:'),sg.Output(key="filtered")],
            [sg.Text(text='Refined message:'),sg.Output(key="refined")],
            [sg.Text(text='Enter a message:'), sg.Multiline(key="imessage",size=(100,3),focus=True)],
            [sg.Button(button_text="Submit")] ]

# Create the Window
window = sg.Window('What\'s That', layout,size=(500,400))

# Event Loop to process "events" and get the "values" of the inputs
while True:
    event, values = window.read()
    if event == sg.WIN_CLOSED: # if user closes window or clicks cancel
        break
    # if event is submit
    if event=='Submit':
        # stripping the message and checking if it is empty
        if (values['imessage'].strip())=="":
            # if yes then show popup
            sg.popup_no_buttons('Message is empty, enter somthing!',title='Empty message!',background_color="white")
        else:
            # call the filter and refine functions on the message 
            # and set the result in output boxes
            message=values['imessage']
            filtered=filter(message)
            window['filtered'].update(filtered)
            refined=refine(message)
            window['refined'].update(refined)
            refinedCumFiltered=refine(filtered)
            window['refined/filtered'].update(refinedCumFiltered)

# when the loop breaks window closes
window.close()