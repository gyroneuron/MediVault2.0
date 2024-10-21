import React, { useEffect, useState } from 'react';

export function UseGreetingMessage() {
  const [greetingMessage, setGreetingMessage] = useState("Good Morning");

  useEffect(() => {
    const updateGreetingMessage = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        return "Good Morning";
      } else if (currentHour < 18) {
        return "Good Afternoon";
      } else {
        return "Good Evening";
      }
    };

    const updateMessage = () => {
      setGreetingMessage(updateGreetingMessage());
    };

    updateMessage();

    const intervalId = setInterval(updateMessage, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return greetingMessage;
}