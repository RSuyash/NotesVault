<?php

declare(strict_types=1);

namespace Firebase\JWT;

use InvalidArgumentException;
use OpenSSLAsymmetricKey;
use OpenSSLCertificate;

final class Key
{
    /** @var string */
    private string $algorithm;
    /** @var string|resource|OpenSSLAsymmetricKey|OpenSSLCertificate */
    private $keyMaterial;

    /**
     * @param string|resource|OpenSSLAsymmetricKey|OpenSSLCertificate $keyMaterial The key material. For symmetric algorithms, this is a string.
     *                                                                             For asymmetric algorithms, this is a PEM certificate or an OpenSSL key resource.
     * @param string $algorithm The algorithm identifier (e.g., HS256, RS256, EdDSA)
     *
     * @throws InvalidArgumentException if the algorithm is not supported
     */
    public function __construct(
        #[\SensitiveParameter] $keyMaterial,
        string $algorithm
    ) {
        if (!isset(JWT::$supported_algs[$algorithm])) {
            throw new InvalidArgumentException('Algorithm not supported');
        }

        // Validate key material specific to algorithm
        [$type] = JWT::$supported_algs[$algorithm];
        if ($type === 'openssl') {
            if (
                !\is_string($keyMaterial)
                && !$keyMaterial instanceof OpenSSLAsymmetricKey
                && !$keyMaterial instanceof OpenSSLCertificate
                && !\is_resource($keyMaterial)
            ) {
                throw new InvalidArgumentException(
                    'Key material must be a PEM formatted string, an OpenSSLAsymmetricKey, or an OpenSSLCertificate'
                );
            }
        } elseif ($type === 'sodium_crypto') {
            if (!\is_string($keyMaterial)) {
                throw new InvalidArgumentException('Key material must be a string');
            }
        } elseif ($type === 'hash_hmac') {
            if (!\is_string($keyMaterial)) {
                throw new InvalidArgumentException('Key material must be a string');
            }
        }

        $this->keyMaterial = $keyMaterial;
        $this->algorithm = $algorithm;
    }

    /**
     * Return the algorithm valid for this key
     *
     * @return string
     */
    public function getAlgorithm(): string
    {
        return $this->algorithm;
    }

    /**
     * @return string|resource|OpenSSLAsymmetricKey|OpenSSLCertificate
     */
    public function getKeyMaterial()
    {
        return $this->keyMaterial;
    }
}
?>