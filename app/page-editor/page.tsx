import { Suspense } from 'react';
import PageEditor from '@/components/page-editor';

export default function PrivacyEditorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <PageEditor />
    </Suspense>
  );
}

export const metadata = {
  title: 'Privacy Policy Editor - Clicksi',
  description: 'Edit and manage privacy policy content',
};