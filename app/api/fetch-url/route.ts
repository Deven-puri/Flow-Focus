import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GazeGuide/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch URL');
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script and style elements
    $('script, style, nav, header, footer, aside').remove();

    // Try to get the main content
    const title = $('title').text() || $('h1').first().text() || 'Untitled';
    
    // Try multiple selectors for main content
    let content = '';
    const contentSelectors = [
      'article',
      '[role="main"]',
      'main',
      '.content',
      '.post-content',
      '#content',
      'body',
    ];

    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.text();
        break;
      }
    }

    // Clean up the text
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();

    if (!content) {
      throw new Error('No content found on the page');
    }

    return NextResponse.json({
      title: title.trim(),
      content: content.substring(0, 50000), // Limit to 50K chars
    });
  } catch (error: any) {
    console.error('Error fetching URL:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch URL content' },
      { status: 500 }
    );
  }
}
