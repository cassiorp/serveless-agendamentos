export async function handler(params:any) {
    console.log('GetAgendas', params);
    
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'GetAgendas',
                input: params,
            },
            null,
            2
        ),
    };
    
}