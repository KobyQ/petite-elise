/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function emailHtmlTemplate(htmlData: any) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>New Registration Request</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
          background-color: #f8f9fa;
        }
        .email-container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: #0056b3;
          color: white;
          text-align: center;
          padding: 16px;
          font-size: 18px;
          font-weight: 600;
        }
        .content {
          padding: 24px;
          color: #333;
        }
        .content h2 {
          font-size: 20px;
          color: #0056b3;
          margin-bottom: 12px;
        }
        .card {
          background: #f4f4f4;
          padding: 16px;
          border-radius: 6px;
          margin-top: 12px;
          font-size: 14px;
        }
      
        @media (max-width: 600px) {
          .content { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">New Registration Request</div>
        <div class="content">
          <h2>Details</h2>
          <div class="card">${htmlData}</div>
        </div>
     
      </div>
    </body>
  </html>
  `;
}

  