#include "Arduino.h"

void setup()
{
  pinMode(LED_BUILTIN, OUTPUT);
}

uint8_t cnt = 0;
uint8_t outgoingReport[64];
uint8_t incommingReport[64];

void loop()
{
  // sending report
  outgoingReport[0] = cnt++;
  usb_rawhid_send(outgoingReport, 100);

  // receiving report
  if (usb_rawhid_recv(incommingReport, 100) > 0) // Wait for a received raw hid report
  {    
    if (incommingReport[0] == 0xAA)
    {
      digitalToggleFast(LED_BUILTIN);
    }
  }

  delay(100);
}
