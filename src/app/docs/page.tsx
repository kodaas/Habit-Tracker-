import Header from "@/components/Header";
import { BookOpen, Calendar, Zap, BarChart3, Wifi, Download } from "lucide-react";

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            <main className="max-w-4xl mx-auto px-8 py-12">
                <div className="mb-12">
                    <h1 className="text-5xl font-bold mb-4">Documentation</h1>
                    <p className="text-xl text-muted-foreground">
                        Learn how to track your habits and build consistency with Grid My Life
                    </p>
                </div>

                {/* Quick Start */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <Zap className="w-8 h-8" />
                        Quick Start
                    </h2>
                    <div className="space-y-4 text-lg">
                        <div className="border-2 border-foreground p-6 bg-muted/50">
                            <h3 className="text-xl font-bold mb-2">1. Create Your First Grid</h3>
                            <p className="text-muted-foreground">
                                Click the "+ CREATE NEW GRID" button on the home page. Give your habit a name
                                (like "Morning Workout" or "Read Daily") and choose how often you want to do it.
                            </p>
                        </div>

                        <div className="border-2 border-foreground p-6 bg-muted/50">
                            <h3 className="text-xl font-bold mb-2">2. Mark Your Days</h3>
                            <p className="text-muted-foreground">
                                Click on any day in the calendar to mark it complete. Click again to unmark it.
                                Use the "Mark Today" button for quick logging!
                            </p>
                        </div>

                        <div className="border-2 border-foreground p-6 bg-muted/50">
                            <h3 className="text-xl font-bold mb-2">3. Track Your Progress</h3>
                            <p className="text-muted-foreground">
                                Watch your streaks grow! The app automatically calculates your current streak,
                                best streak, and total days completed.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Streak Modes */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <Calendar className="w-8 h-8" />
                        Streak Modes
                    </h2>
                    <p className="text-lg mb-6 text-muted-foreground">
                        Choose the right mode for your habit type:
                    </p>
                    <div className="grid gap-4">
                        <div className="border-2 border-foreground p-6">
                            <h3 className="text-xl font-bold mb-2">Every Day</h3>
                            <p className="text-muted-foreground">
                                Perfect for daily habits like drinking water, taking vitamins, or meditation.
                                Your streak continues as long as you don't miss a day.
                            </p>
                        </div>

                        <div className="border-2 border-foreground p-6">
                            <h3 className="text-xl font-bold mb-2">Twice Daily</h3>
                            <p className="text-muted-foreground">
                                For habits you do morning and evening, like brushing teeth or taking medication.
                                Mark once per day currently (advanced tracking coming soon).
                            </p>
                        </div>

                        <div className="border-2 border-foreground p-6">
                            <h3 className="text-xl font-bold mb-2">Times Per Week</h3>
                            <p className="text-muted-foreground">
                                Set a weekly goal (1-7 times). Great for gym sessions, journaling, or studying.
                                Your streak counts successful weeks, not individual days.
                            </p>
                        </div>

                        <div className="border-2 border-foreground p-6">
                            <h3 className="text-xl font-bold mb-2">Every Weekday</h3>
                            <p className="text-muted-foreground">
                                Monday through Friday only. Perfect for work-related habits or activities
                                you only do during the work week.
                            </p>
                        </div>

                        <div className="border-2 border-foreground p-6">
                            <h3 className="text-xl font-bold mb-2">Every Other Day</h3>
                            <p className="text-muted-foreground">
                                Alternating day pattern. Ideal for recovery-based activities like strength
                                training with rest days.
                            </p>
                        </div>

                        <div className="border-2 border-foreground p-6">
                            <h3 className="text-xl font-bold mb-2">Weekends Only</h3>
                            <p className="text-muted-foreground">
                                Saturday and Sunday only. Great for weekend projects, hobbies, or
                                personal development activities.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Views */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6">Calendar Views</h2>
                    <p className="text-lg mb-6 text-muted-foreground">
                        Switch between different time periods to see your progress:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="border-2 border-foreground p-6">
                            <h3 className="text-xl font-bold mb-2">Year View</h3>
                            <p className="text-muted-foreground">
                                See your entire year at a glance. Perfect for spotting patterns and long-term trends.
                            </p>
                        </div>

                        <div className="border-2 border-foreground p-6">
                            <h3 className="text-xl font-bold mb-2">Month View</h3>
                            <p className="text-muted-foreground">
                                Traditional calendar layout showing the current month with larger cells.
                            </p>
                        </div>

                        <div className="border-2 border-foreground p-6">
                            <h3 className="text-xl font-bold mb-2">Week View</h3>
                            <p className="text-muted-foreground">
                                Focus on the current week. Great for planning and staying on track day by day.
                            </p>
                        </div>

                        <div className="border-2 border-foreground p-6">
                            <h3 className="text-xl font-bold mb-2">Day View</h3>
                            <p className="text-muted-foreground">
                                Single day focus with a large, easy-to-tap interface.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Page Views */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6">Page Views</h2>
                    <div className="grid gap-4">
                        <div className="border-2 border-foreground p-6">
                            <h3 className="text-xl font-bold mb-2">Full Screen</h3>
                            <p className="text-muted-foreground">
                                Shows all your grids with full calendars. Perfect for detailed tracking and editing.
                            </p>
                        </div>

                        <div className="border-2 border-foreground p-6">
                            <h3 className="text-xl font-bold mb-2">Cards</h3>
                            <p className="text-muted-foreground">
                                Compact summary cards showing key stats. Click "Edit" to open the full grid modal for any habit.
                            </p>
                        </div>

                        <div className="border-2 border-foreground p-6 bg-accent/10">
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                Analytics
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Deep dive into your habit statistics! See completion rates, day-of-week patterns,
                                consistency scores, and more. Filter by time period to track your progress.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Pro Tips */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6">Pro Tips</h2>
                    <div className="space-y-4 text-lg">
                        <div className="border-l-4 border-accent pl-6 py-2">
                            <p className="font-bold mb-1">🎯 Drag to Select</p>
                            <p className="text-muted-foreground">
                                Click and hold on a date, then drag across multiple days to mark or unmark them all at once!
                            </p>
                        </div>

                        <div className="border-l-4 border-accent pl-6 py-2">
                            <p className="font-bold mb-1">📅 Go to Today</p>
                            <p className="text-muted-foreground">
                                Lost in time? Click the "Go to Today" button in any calendar view to jump back to the current date.
                            </p>
                        </div>

                        <div className="border-l-4 border-accent pl-6 py-2">
                            <p className="font-bold mb-1">📊 Check Analytics</p>
                            <p className="text-muted-foreground">
                                Use the Analytics tab to discover which days of the week you're most consistent.
                            </p>
                        </div>

                        <div className="border-l-4 border-accent pl-6 py-2">
                            <p className="font-bold mb-1">⚡ Keyboard-Free</p>
                            <p className="text-muted-foreground">
                                Everything can be done with clicks and taps—perfect for quick logging!
                            </p>
                        </div>
                    </div>
                </section>

                {/* Offline Mode */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <Wifi className="w-8 h-8" />
                        Offline Mode
                    </h2>
                    <div className="border-2 border-foreground p-8 bg-muted/50">
                        <p className="text-lg mb-4">
                            <span className="font-bold">Grid My Life works completely offline!</span> All your data is stored
                            locally on your device, so you can track your habits anytime, anywhere—no internet required.
                        </p>
                        <p className="text-muted-foreground">
                            After your first visit, the app caches all resources. Even if you lose connection,
                            everything keeps working perfectly.
                        </p>
                    </div>
                </section>

                {/* Install */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <Download className="w-8 h-8" />
                        Install as an App
                    </h2>
                    <div className="space-y-4">
                        <div className="border-2 border-foreground p-6">
                            <h3 className="text-xl font-bold mb-2">On Mobile (iOS/Android)</h3>
                            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                <li>Open Grid My Life in your browser (Safari on iOS, Chrome on Android)</li>
                                <li>Tap the Share button (iOS) or menu (Android)</li>
                                <li>Select "Add to Home Screen"</li>
                                <li>Confirm - the app icon will appear on your home screen!</li>
                            </ol>
                        </div>

                        <div className="border-2 border-foreground p-6">
                            <h3 className="text-xl font-bold mb-2">On Desktop (Chrome/Edge)</h3>
                            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                <li>Look for the install icon in your browser's address bar</li>
                                <li>Click it and select "Install"</li>
                                <li>The app will open in its own window, just like a native app!</li>
                            </ol>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <div className="border-t-2 border-foreground pt-8 text-center text-muted-foreground">
                    <p className="text-lg">
                        Need more help? Your data is always yours—stored locally, private, and secure.
                    </p>
                </div>
            </main>
        </div>
    );
}
