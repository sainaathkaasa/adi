import React, { useState } from 'react';

const QuickSightEmbed = () => {
  const embedUrl =
    `https://us-east-1.quicksight.aws.amazon.com/embed/1fea93ac4d024f4dade6e7f5a4a56226/dashboards/09aad7c5-5761-45a1-ac45-aa6654bafa9c?code=AYABeDB6YPZ5zqP-QBOswApnDDEAAAABAAdhd3Mta21zAEthcm46YXdzOmttczp1cy1lYXN0LTE6MjU5NDgwNDYyMTMyOmtleS81NGYwMjdiYy03MDJhLTQxY2YtYmViNS0xNDViOTExNzFkYzMAuAECAQB4xtoTZf7IGoPQKGWjcNLglYg8fHKEoB_X6wbByfSPUT0BMQRR1ZNleAai-CJmarTemAAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDBKVKOk3PpC1GMeRJQIBEIA7LNNY10z8wYRaEfqYRn9JAytrsDz3WmtrWIoTepfXzKMslDlLVmOxqug_mqXFO60B28-8TfWkZBw7CvoCAAAAAAwAABAAAAAAAAAAAAAAAAAAayk8NKC927rIp1NB6kd0IP____8AAAABAAAAAAAAAAAAAAABAAAAmxkfHPYEiYf-TdcsJ9e3U9NX8GqbpZrpTyHiSsIrHBTSEwLPjk7ko9xURTTGBpKehDLvwfO8uLnkX4VrfKU8TlqsvtxV7eJCrUhP-xlLsp4Tx_6CUMoOGcjNi31nriMeR3sDaNQmQPo_-WwETa4iGAHsDRex_QxUKjfE_cEeCaGYxCrOEqnwyWuELabkClDbXgajb5HXbI_jlrzrI8dIEt8VGx8MYGHpaZYObw%3D%3D&identityprovider=quicksight&isauthcode=true`;

  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      {hasError ? (
        <div>
          <p>
            We’re sorry, an error occurred while loading the QuickSight
            dashboard.
          </p>
          <a
            href="https://us-east-1.quicksight.aws.amazon.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit QuickSight Home Page
          </a>
        </div>
      ) : (
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 'none' }}
          title="QuickSight Dashboard"
          onError={handleError}
        />
      )}
    </div>
  );
};

export default QuickSightEmbed;
