import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        api: 'operational',
        ai: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY ? 'operational' : 'unavailable',
        storage: 'operational'
      },
      features: {
        recording: 'enabled',
        aiSummary: 'enabled',
        stateSpecificRights: 'enabled',
        multiLanguage: 'enabled',
        sharing: 'enabled'
      }
    };

    return NextResponse.json(healthCheck);
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      },
      { status: 500 }
    );
  }
}
