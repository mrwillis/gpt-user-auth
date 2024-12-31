import { APIGatewayProxyEvent } from 'aws-lambda';

export async function privacyPolicyHandler(event: APIGatewayProxyEvent) {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET'
        },
        body: `
<!DOCTYPE html>
<html>
<head>
    <title>Privacy Policy - Your Custom GPT</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3 {
            color: #333;
        }
        ul {
            margin-left: 20px;
        }
    </style>
</head>
<body>
    <h1>Privacy Policy</h1>
    <p>Your Custom GPT ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our custom GPT language app ("the App"). Please read this policy carefully to understand our practices regarding your information and how we will treat it.</p>

    <h2>1. Information We Collect</h2>
    
    <h3>1.1 User-Provided Information</h3>
    <p>When you use the App, we may collect information that you provide directly, such as:</p>
    <ul>
        <li>Name or username</li>
        <li>Contact information (if provided)</li>
        <li>Preferences and settings within the App</li>
    </ul>

    <h3>1.2 Automatically Collected Information</h3>
    <p>We may automatically collect certain information about your device and usage, such as:</p>
    <ul>
        <li>Device type and operating system</li>
        <li>IP address</li>
        <li>App usage data (e.g., features accessed, duration of use)</li>
    </ul>

    <h3>1.3 Conversation History</h3>
    <p>To enhance your experience, the App stores your conversation history to better adapt to your language proficiency level and personalized needs. This data is anonymized and stored securely.</p>

    <h2>2. How We Use Your Information</h2>
    <p>We use the information we collect to:</p>
    <ul>
        <li>Provide, operate, and improve the App's features</li>
        <li>Personalize your experience, including tailoring responses to your proficiency level</li>
        <li>Communicate with you about updates or new features</li>
        <li>Monitor and analyze usage patterns to improve performance</li>
    </ul>

    <h2>3. Information Sharing and Disclosure</h2>
    <p>We do not sell, trade, or rent your personal information to third parties. However, we may share your information in the following circumstances:</p>
    <ul>
        <li><strong>With Service Providers:</strong> To facilitate the operation of the App, we may share anonymized data with trusted third-party service providers who comply with strict confidentiality agreements.</li>
        <li><strong>As Required by Law:</strong> If required to do so by law or if we believe such action is necessary to comply with legal obligations or to protect the rights, property, or safety of the App or its users.</li>
    </ul>

    <h2>4. Data Retention</h2>
    <p>Your conversation history is retained for as long as necessary to fulfill the purposes outlined in this policy or as required by law. You can request the deletion of your data at any time by contacting us at [Insert Contact Information].</p>

    <h2>5. Data Security</h2>
    <p>We implement appropriate technical and organizational measures to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no data transmission or storage system can be guaranteed 100% secure.</p>

    <h2>6. Your Rights</h2>
    <p>Depending on your location, you may have certain rights regarding your data, such as:</p>
    <ul>
        <li>Accessing your data</li>
        <li>Requesting corrections to your data</li>
        <li>Requesting deletion of your data</li>
        <li>Opting out of certain data uses</li>
    </ul>
    <p>To exercise your rights, contact us at [Insert Contact Information].</p>

    <h2>7. Third-Party Links</h2>
    <p>The App may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.</p>

    <h2>8. Children's Privacy</h2>
    <p>The App is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will take steps to delete it.</p>

    <h2>9. Changes to This Privacy Policy</h2>
    <p>We may update this Privacy Policy from time to time. Any changes will be posted within the App, and the updated policy will include the "Effective Date." Continued use of the App after changes indicates your acceptance of the updated policy.</p>

    <h2>10. Contact Us</h2>
    <p>If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
    <p>privacy@yourcustomgpt.com</p>

    <p>By using the App, you agree to the terms of this Privacy Policy.</p>
    
    <p><small>Last updated: ${new Date().toISOString().split('T')[0]}</small></p>
</body>
</html>`
    };
} 