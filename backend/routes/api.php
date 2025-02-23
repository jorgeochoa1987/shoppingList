<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{ShoppingListController, ItemController};


Route::middleware('auth:sanctum')->group(function () {

});

//ob_clean();

Route::apiResource('shopping-lists', ShoppingListController::class);

Route::prefix('shopping-lists/{shoppingList}')->group(function () {
    Route::apiResource('items', ItemController::class)->except(['index', 'show']);
});

Route::post('ai-shopping', function (Request $request) {

    try{

        $content = json_decode($request->getContent());

        if(!isset($content->message)){
            throw new Exception('Message is required');
        }

        $curl = curl_init();


        $message = $content->message;

        curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCMu_s318HEi_gJVG1wBE1k6BSQUCTtn_E',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS =>'{
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": "Genera un JSON basado en los siguientes datos de entrada. Te enviaré un producto, un peso (que puede estar en kilogramos, libras, etc.), un lugar de compra y un precio (en pesos colombianos). Los datos pueden enviarse en cualquier orden. Asegúrate de convertir el peso a la unidad adecuada (kilogramos) y el precio al formato numérico. Ten en cuenta que en Colombia a veces se refiere a la moneda local como \'lucas\' o \'luks\' o similares. En algunas regiones se usa el \'k\' para referirse a miles, y en otras, como la costa atlántica, se dice \'barras\'. Ejemplo:\\nEntrada del Usuario:\\n```\\nPapa, 2k, Carulla, 4mil\\n```\\nSalida Esperada en JSON:\\n```\\n{\\n  \\\\\\"producto\\\\\\": \\\\\\"papa\\\\\\",\\n  \\\\\\"peso\\\\\\": \\\\\\"2kg\\\\\\",\\n  \\\\\\"precio\\\\\\": 4000,\\n  \\\\\\"lugar\\\\\\": \\\\\\"Carulla\\\\\\"\\n}\\n```"
                        }
                    ]
                },
                {
                    "role": "model",
                    "parts": [
                        {
                            "text": "Entendido. Estoy listo para recibir los datos en cualquier orden y generar el JSON con las conversiones necesarias.  Espera mi señal (es decir, un mensaje como \\"Listo, envíame los datos\\") antes de enviarme los datos. ¡Listo, envíame los datos!\\n"
                        }
                    ]
                },
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": "'.$message.'"
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 1,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 8192,
                "responseMimeType": "text/plain"
            }
        }',
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json'
        ),
        ));

        $answer = curl_exec($curl);
        
        curl_close($curl);
    }catch(\Exception $exeption){
        $answer = $exeption->getMessage();
        $status = 500;
    }

    return response()->json([
        'message' => $answer
    ], $status ?? 200);

});