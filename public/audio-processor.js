class PCMProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input.length > 0) {
            const float32Tensor = input[0];
            const int16Array = new Int16Array(float32Tensor.length);
            for (let i = 0; i < float32Tensor.length; i++) {
                // Clamp to [-1, 1]
                const s = Math.max(-1, Math.min(1, float32Tensor[i]));
                // Convert to 16-bit PCM
                int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
            this.port.postMessage(int16Array.buffer);
        }
        return true;
    }
}

registerProcessor("pcm-processor", PCMProcessor);
