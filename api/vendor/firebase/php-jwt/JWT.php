<?php

declare(strict_types=1);

namespace Firebase\JWT;

use DomainException;
use Exception; // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter
use InvalidArgumentException;
use UnexpectedValueException;
use DateTime;

/**
 * JSON Web Token implementation
 *
 * Minimum implementation used by Realtime Database
 *
 * @author Neuman Vong <neuman@twilio.com>
 * @author Chris Corbyn <chris@w3style.co.uk>
 */
class JWT
{
    private const ASN1_INTEGER = 0x02;
    private const ASN1_SEQUENCE = 0x30;
    private const ASN1_BIT_STRING = 0x03;

    /**
     * When checking nbf, iat or expiration times,
     * we want to provide some extra leeway time to
     * account for clock skew.
     */
    public static int $leeway = 0;

    /**
     * Allow the current timestamp to be specified.
     * Useful for fixing a value within unit testing.
     *
     * Will default to PHP time() value if null.
     */
    public static ?int $timestamp = null;

    /**
     * @var array<string, string>
     */
    public static array $supported_algs = [
        'ES384' => ['openssl', 'SHA384'],
        'ES256' => ['openssl', 'SHA256'],
        'ES256K' => ['openssl', 'SHA256'],
        'HS256' => ['hash_hmac', 'SHA256'],
        'HS384' => ['hash_hmac', 'SHA384'],
        'HS512' => ['hash_hmac', 'SHA512'],
        'RS256' => ['openssl', 'SHA256'],
        'RS384' => ['openssl', 'SHA384'],
        'RS512' => ['openssl', 'SHA512'],
        'EdDSA' => ['sodium_crypto', 'EdDSA'],
    ];

    /**
     * Decodes a JWT string into a PHP object.
     *
     * @param string                 $jwt            The JWT
     * @param Key|array<string, Key> $keyOrKeyArray  The key, keys or key set.
     *                                               If the algorithm used is asymmetric, this is the public key
     *                                               Each key object contains an algorithm and matching key material
     * @param array<string>          $allowed_algs   List of supported verification algorithms
     *                                               Supported algorithms are defined in ::$supported_algs
     *
     * @return object The JWT's payload as a PHP object
     *
     * @throws InvalidArgumentException     Provided key/key-array was empty or malformed
     * @throws DomainException              Provided JWT is malformed
     * @throws UnexpectedValueException     Provided JWT was invalid
     * @throws SignatureInvalidException    Provided JWT was invalid because the signature verification failed
     * @throws BeforeValidException         Provided JWT is trying to be used before it's eligible as defined by 'nbf'
     * @throws BeforeValidException         Provided JWT is trying to be used before it's been created as defined by 'iat'
     * @throws ExpiredException             Provided JWT has since expired, as defined by the 'exp' claim
     *
     * @uses jsonDecode
     * @uses urlsafeB64Decode
     */
    public static function decode(
        string $jwt,
        #[\SensitiveParameter] $keyOrKeyArray
    ): object {
        // Validate JWT
        $timestamp = \is_null(static::$timestamp) ? \time() : static::$timestamp;

        if (empty($keyOrKeyArray)) {
            throw new InvalidArgumentException('Key may not be empty');
        }

        $tks = \explode('.', $jwt);
        if (\count($tks) !== 3) {
            throw new UnexpectedValueException('Wrong number of segments');
        }
        [$headb64, $bodyb64, $cryptob64] = $tks;
        $headerRaw = static::urlsafeB64Decode($headb64);
        if (null === ($header = static::jsonDecode($headerRaw))) {
            throw new UnexpectedValueException('Invalid header encoding');
        }
        $payloadRaw = static::urlsafeB64Decode($bodyb64);
        if (null === ($payload = static::jsonDecode($payloadRaw))) {
            // Assume that the payload is not JSON, and attempt to decode as plain text
            $payload = $payloadRaw;
        }
        if (\is_array($payload)) {
            // Convert payload to object
            $payload = (object) $payload;
        }
        if (!$payload instanceof \stdClass && !\is_string($payload)) {
            throw new UnexpectedValueException('Invalid payload encoding');
        }
        $sig = static::urlsafeB64Decode($cryptob64);
        if (empty($header->alg)) {
            throw new UnexpectedValueException('Empty algorithm');
        }
        if (empty(static::$supported_algs[$header->alg])) {
            throw new UnexpectedValueException('Algorithm not supported');
        }

        $key = self::getKey($keyOrKeyArray, $header->kid ?? null);

        // Check the algorithm
        if ($header->alg !== $key->getAlgorithm()) {
            throw new UnexpectedValueException('Incorrect key for this algorithm');
        }

        // Verify Signature
        if (!static::verify("{$headb64}.{$bodyb64}", $sig, $key->getKeyMaterial(), $header->alg)) {
            throw new SignatureInvalidException('Signature verification failed');
        }

        // Check the nbf if it is defined. This is the time that the
        // token can actually be used. If it's not yet that time, abort.
        if (isset($payload->nbf) && $payload->nbf > ($timestamp + static::$leeway)) {
            throw new BeforeValidException(
                'Cannot handle token prior to ' . \date(DateTime::ISO8601, $payload->nbf)
            );
        }

        // Check that this token has been created before 'now'. This prevents
        // using tokens that have been created for later use (and potentially
        // generating the same token itself).
        if (isset($payload->iat) && $payload->iat > ($timestamp + static::$leeway)) {
            throw new BeforeValidException(
                'Cannot handle token prior to ' . \date(DateTime::ISO8601, $payload->iat)
            );
        }

        // Check if this token has expired.
        if (isset($payload->exp) && ($timestamp - static::$leeway) >= $payload->exp) {
            throw new ExpiredException('Expired token');
        }

        return $payload;
    }

    /**
     * Converts and signs a PHP object or array into a JWT string.
     *
     * @param object|array<mixed> $payload PHP object or array
     * @param string|resource|\OpenSSLAsymmetricKey|\OpenSSLCertificate $key The secret key.
     * @param string $alg The signing algorithm.
     * @param string $keyId Key ID optional header parameter
     * @param array<string, string> $head An array with header elements to attach
     *
     * @return string A signed JWT
     *
     * @uses jsonEncode
     * @uses urlsafeB64Encode
     */
    public static function encode(
        object|array $payload,
        #[\SensitiveParameter] $key,
        string $alg,
        ?string $keyId = null,
        ?array $head = null
    ): string {
        $header = ['typ' => 'JWT', 'alg' => $alg];
        if ($keyId !== null) {
            $header['kid'] = $keyId;
        }
        if (isset($head) && \is_array($head)) {
            $header = \array_merge($head, $header);
        }

        $segments = [];
        $segments[] = static::urlsafeB64Encode((string) static::jsonEncode($header));
        $segments[] = static::urlsafeB64Encode((string) static::jsonEncode($payload));
        $signing_input = \implode('.', $segments);

        $signature = static::sign($signing_input, $key, $alg);
        $segments[] = static::urlsafeB64Encode($signature);

        return \implode('.', $segments);
    }

    /**
     * Sign a string with a given key and algorithm.
     *
     * @param string $msg The message to sign
     * @param string|resource|\OpenSSLAsymmetricKey|\OpenSSLCertificate $key The secret key.
     * @param string $alg The signing algorithm.
     *                    Supported algorithms are defined in ::$supported_algs
     *
     * @return string An encrypted message
     *
     * @throws DomainException Unsupported algorithm was specified
     */
    private static function sign(
        string $msg,
        #[\SensitiveParameter] $key,
        string $alg
    ): string {
        if (empty(static::$supported_algs[$alg])) {
            throw new DomainException('Algorithm not supported');
        }
        [$function, $algorithm] = static::$supported_algs[$alg];
        switch ($function) {
            case 'hash_hmac':
                if (!\is_string($key)) {
                    throw new InvalidArgumentException('key must be a string when using hmac');
                }
                return \hash_hmac($algorithm, $msg, $key, true);
            case 'openssl':
                $signature = '';
                $success = \openssl_sign($msg, $signature, $key, $algorithm);
                if (!$success) {
                    throw new DomainException('OpenSSL unable to sign data');
                }
                if ($alg === 'ES256' || $alg === 'ES256K') {
                    $signature = self::signatureToDER($signature);
                } elseif ($alg === 'ES384') {
                    $signature = self::signatureToDER($signature, 48);
                }
                return $signature;
            case 'sodium_crypto':
                if (!\function_exists('sodium_crypto_sign_detached')) {
                    throw new DomainException('libsodium is not available');
                }
                if (!\is_string($key)) {
                    throw new InvalidArgumentException('key must be a string when using EdDSA');
                }
                try {
                    // The last non-empty line is the key using sodium_import_base64_key
                    $lines = \array_filter(\explode("\n", $key));
                    $key = \sodium_crypto_sign_secretkey(\base64_decode(\end($lines)));

                    return \sodium_crypto_sign_detached($msg, $key);
                } catch (Exception $e) {
                    throw new DomainException($e->getMessage(), 0, $e);
                }
        }

        throw new DomainException('Algorithm not supported');
    }

    /**
     * Verify a signature with the message, key and method. Not all methods
     * are symmetric, so we must have a separate verify and sign method.
     *
     * @param string $msg The original message (header and body)
     * @param string $signature The original signature
     * @param string|resource|\OpenSSLAsymmetricKey|\OpenSSLCertificate $key For HS*, a string key works. for RS*, must be an instance of OpenSSLAsymmetricKey or OpenSSLCertificate
     * @param string $alg The algorithm
     *
     * @return bool
     *
     * @throws DomainException Invalid Algorithm or OpenSSL failure
     */
    private static function verify(
        string $msg,
        string $signature,
        #[\SensitiveParameter] $key,
        string $alg
    ): bool {
        if (empty(static::$supported_algs[$alg])) {
            throw new DomainException('Algorithm not supported');
        }

        [$function, $algorithm] = static::$supported_algs[$alg];
        switch ($function) {
            case 'openssl':
                if ($alg === 'ES256' || $alg === 'ES256K') {
                    // ES256/ES256K signatures are returned as ASN.1 DER structures, so parse the signature
                    $signature = self::signatureFromDER($signature, 256);
                } elseif ($alg === 'ES384') {
                    // ES384 signatures are returned as ASN.1 DER structures, so parse the signature
                    $signature = self::signatureFromDER($signature, 384);
                }

                $success = \openssl_verify($msg, $signature, $key, $algorithm);

                if ($success === 1) {
                    return true;
                }
                if ($success === 0) {
                    return false;
                }
                // returns 1 on success, 0 on failure, -1 on error.
                throw new DomainException(
                    'OpenSSL error: ' . \openssl_error_string()
                );
            case 'sodium_crypto':
                if (!\function_exists('sodium_crypto_sign_verify_detached')) {
                    throw new DomainException('libsodium is not available');
                }
                if (!\is_string($key)) {
                    throw new InvalidArgumentException('key must be a string when using EdDSA');
                }
                try {
                    // The last non-empty line is the key using sodium_import_base64_key
                    $lines = \array_filter(\explode("\n", $key));
                    $key = \sodium_crypto_sign_publickey(\base64_decode(\end($lines)));

                    return \sodium_crypto_sign_verify_detached($signature, $msg, $key);
                } catch (Exception $e) {
                    throw new DomainException($e->getMessage(), 0, $e);
                }
            case 'hash_hmac':
            default:
                if (!\is_string($key)) {
                    throw new InvalidArgumentException('key must be a string when using hmac');
                }
                $hash = \hash_hmac($algorithm, $msg, $key, true);
                return \hash_equals($signature, $hash);
        }
    }

    /**
     * Decode a JSON string into a PHP object.
     *
     * @param string $input JSON string
     *
     * @return mixed The decoded JSON string
     *
     * @throws DomainException Provided string was invalid JSON
     */
    public static function jsonDecode(string $input)
    {
        $obj = \json_decode($input, false, 512, \JSON_BIGINT_AS_STRING);

        if ($errno = \json_last_error()) {
            static::handleJsonError($errno);
        } elseif ($obj === null && $input !== 'null') {
            throw new DomainException('Null result with non-null input');
        }
        return $obj;
    }

    /**
     * Encode a PHP array into a JSON string.
     *
     * @param object|array<mixed> $input A PHP array or object to encode
     *
     * @return string JSON representation of the PHP array or object
     *
     * @throws DomainException Provided object could not be encoded to valid JSON
     */
    public static function jsonEncode(object|array $input): string
    {
        $json = \json_encode($input);

        if ($errno = \json_last_error()) {
            static::handleJsonError($errno);
        } elseif ($json === 'null' && $input !== null) {
            throw new DomainException('Null result with non-null input');
        }
        if ($json === false) {
            throw new DomainException('Provided object could not be encoded to valid JSON');
        }

        return $json;
    }

    /**
     * Decode a string with URL-safe Base64.
     *
     * @param string $input A Base64 encoded string
     *
     * @return string A decoded string
     *
     * @throws InvalidArgumentException invalid base64 characters
     */
    public static function urlsafeB64Decode(string $input): string
    {
        $remainder = \strlen($input) % 4;
        if ($remainder) {
            $padlen = 4 - $remainder;
            $input .= \str_repeat('=', $padlen);
        }
        $decoded = \base64_decode(\strtr($input, '-_', '+/'));

        if ($decoded === false) {
            throw new InvalidArgumentException('Malformed UTF-8 characters');
        }

        return $decoded;
    }

    /**
     * Encode a string with URL-safe Base64.
     *
     * @param string $input The string you want encoded
     *
     * @return string The base64 encode of what you passed in
     */
    public static function urlsafeB64Encode(string $input): string
    {
        return \str_replace('=', '', \strtr(\base64_encode($input), '+/', '-_'));
    }

    /**
     * Determine if an algorithm has been provided for generating a signature.
     *
     * @param string $alg Algorithm identifier (e.g., HS256, RS256, EdDSA)
     *
     * @throws DomainException if the algorithm is not supported
     */
    private static function checkAlgorithm(string $alg): void
    {
        if (!isset(static::$supported_algs[$alg])) {
            throw new DomainException('Algorithm not supported');
        }
    }

    /**
     * Helper method to create a JSON error.
     *
     * @param int $errno An error number from json_last_error()
     *
     * @return void
     *
     * @throws DomainException
     */
    private static function handleJsonError(int $errno): void
    {
        $messages = [
            \JSON_ERROR_DEPTH => 'Maximum stack depth exceeded',
            \JSON_ERROR_STATE_MISMATCH => 'Invalid or malformed JSON',
            \JSON_ERROR_CTRL_CHAR => 'Unexpected control character found',
            \JSON_ERROR_SYNTAX => 'Syntax error, malformed JSON',
            \JSON_ERROR_UTF8 => 'Malformed UTF-8 characters' //PHP >= 5.3.3
        ];
        throw new DomainException(
            $messages[$errno] ?? 'Unknown JSON error: ' . $errno
        );
    }

    /**
     * Get the number of bits in cryptographic key.
     *
     * @param string|resource|\OpenSSLAsymmetricKey|\OpenSSLCertificate $key - The key
     *
     * @return int
     *
     * @throws DomainException $key is invalid
     */
    private static function getKeyLength(
        #[\SensitiveParameter] $key
    ): int {
        if (\is_string($key)) {
            // Keys can be passed as PEM certificates or raw keys
            if (\str_starts_with($key, '-----BEGIN')) {
                $key = \openssl_pkey_get_public($key);
            } else {
                // Assume raw key format
                return \mb_strlen($key, '8bit');
            }
        }

        if (\is_resource($key) || $key instanceof \OpenSSLAsymmetricKey || $key instanceof \OpenSSLCertificate) {
            $details = \openssl_pkey_get_details($key);
            if ($details === false) {
                throw new DomainException('Invalid key: ' . \openssl_error_string());
            }
            if (!isset($details['bits'])) {
                throw new DomainException('Key details not found');
            }
            return (int) $details['bits'];
        }

        throw new DomainException('Invalid key type');
    }

    /**
     * Get the key based on the Key ID
     *
     * @param Key|array<string, Key> $keyOrKeyArray The key or array of keys.
     * @param string|null $kid The Key ID
     *
     * @return Key The key to use for signing/verification
     *
     * @throws UnexpectedValueException No key found matching the Key ID
     */
    private static function getKey(
        #[\SensitiveParameter] $keyOrKeyArray,
        ?string $kid = null
    ): Key {
        if ($keyOrKeyArray instanceof Key) {
            // Use the single key provided
            return $keyOrKeyArray;
        }

        // Find the correct key based on the key ID
        if ($kid === null || empty($keyOrKeyArray)) {
            throw new UnexpectedValueException('"kid" empty, unable to lookup correct key');
        }
        if (!isset($keyOrKeyArray[$kid])) {
            throw new UnexpectedValueException(\sprintf('Key ID "%s" not found', $kid));
        }

        return $keyOrKeyArray[$kid];
    }

    /**
     * Converts an ECDSA signature to an ASN.1 DER structure
     *
     * @param string $sig The ECDSA signature to convert
     * @return string The encoded DER structure
     */
    private static function signatureToDER(string $sig, int $keySize = 32): string
    {
        // Separate the signature into r-value and s-value
        [$r, $s] = \str_split($sig, (int) (\strlen($sig) / 2));

        // Trim leading zeros
        $r = \ltrim($r, "\x00");
        $s = \ltrim($s, "\x00");

        // Convert r-value and s-value from unsigned big-endian integers to
        // signed two's complement
        if (\ord($r[0]) > 0x7f) {
            $r = "\x00" . $r;
        }
        if (\ord($s[0]) > 0x7f) {
            $s = "\x00" . $s;
        }

        return self::encodeDER(
            self::ASN1_SEQUENCE,
            self::encodeDER(self::ASN1_INTEGER, $r) .
            self::encodeDER(self::ASN1_INTEGER, $s)
        );
    }

    /**
     * Encodes a value into an ASN.1 DER structure.
     *
     * @param int $type The ASN.1 type
     * @param string $value The value to encode
     * @return string The encoded DER structure
     */
    private static function encodeDER(int $type, string $value): string
    {
        $tag_header = $type;

        // Type that is constructed and structured
        if ($type === self::ASN1_SEQUENCE) {
            $tag_header |= 0x20;
        }

        // Length
        $length = \strlen($value);
        if ($length < 128) {
            $der = \chr($tag_header) . \chr($length) . $value;
        } elseif ($length < 256) {
            $der = \chr($tag_header) . \chr(0x81) . \chr($length) . $value;
        } elseif ($length < 65536) {
            $der = \chr($tag_header) . \chr(0x82) . \chr($length >> 8) . \chr($length & 0xFF) . $value;
        } else {
            throw new DomainException('ASN.1 DER length too long');
        }

        return $der;
    }

    /**
     * Encodes signature from ASN.1 DER data.
     *
     * @param string $derSignature ASN.1 DER data
     * @param int $keySize The key size in bits
     * @return string Signature
     */
    private static function signatureFromDER(string $derSignature, int $keySize): string
    {
        // Parse the ASN.1 DER structure
        $components = self::parseDER($derSignature);
        if (\count($components) !== 2) {
            throw new DomainException('Invalid ASN.1 DER structure');
        }

        // Extract r-value and s-value
        [$r, $s] = $components;

        // Ensure r and s are positive integers
        if (\ord($r[0]) === 0x00 && \ord($r[1]) & 0x80) {
            $r = \substr($r, 1);
        }
        if (\ord($s[0]) === 0x00 && \ord($s[1]) & 0x80) {
            $s = \substr($s, 1);
        }

        // Pad r and s to the expected key size
        $byteSize = (int) \ceil($keySize / 8);
        $r = \str_pad($r, $byteSize, "\x00", \STR_PAD_LEFT);
        $s = \str_pad($s, $byteSize, "\x00", \STR_PAD_LEFT);

        return $r . $s;
    }

    /**
     * Parses an ASN.1 DER structure.
     *
     * @param string $derData ASN.1 DER data
     * @return array<int, string> The parsed components
     */
    private static function parseDER(string $derData): array
    {
        $components = [];
        $offset = 0;
        while ($offset < \strlen($derData)) {
            $tag = \ord($derData[$offset++]);
            $length = \ord($derData[$offset++]);
            if ($length & 0x80) { // Long form length
                $lengthBytes = $length & 0x7F;
                $length = 0;
                for ($i = 0; $i < $lengthBytes; $i++) {
                    $length = ($length << 8) + \ord($derData[$offset++]);
                }
            }
            $value = \substr($derData, $offset, $length);
            $offset += $length;

            if ($tag === self::ASN1_SEQUENCE) {
                // If it's a sequence, parse its components recursively
                $components = \array_merge($components, self::parseDER($value));
            } elseif ($tag === self::ASN1_INTEGER) {
                $components[] = $value;
            }
        }
        return $components;
    }
}
?>