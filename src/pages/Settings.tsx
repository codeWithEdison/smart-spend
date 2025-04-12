
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CloudUpload, FileDown, Trash2, Settings as SettingsIcon, Bell, Shield } from 'lucide-react';

interface UserPreferences {
  currency: string;
  darkMode: boolean;
  notifications: boolean;
  weekStartsOn: 'monday' | 'sunday';
}

const Settings = () => {
  const [importFile, setImportFile] = useState<File | null>(null);
  
  // Load user preferences from localStorage
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const savedPrefs = localStorage.getItem('userPreferences');
    return savedPrefs ? JSON.parse(savedPrefs) : {
      currency: 'USD',
      darkMode: false,
      notifications: true,
      weekStartsOn: 'monday'
    };
  });
  
  const form = useForm({
    defaultValues: preferences
  });
  
  const handleExportData = () => {
    try {
      const transactions = localStorage.getItem('transactions') || '[]';
      const categories = localStorage.getItem('categories') || '[]';
      const savingsGoals = localStorage.getItem('savingsGoals') || '[]';
      const userPreferences = localStorage.getItem('userPreferences') || '{}';
      
      const data = {
        transactions: JSON.parse(transactions),
        categories: JSON.parse(categories),
        savingsGoals: JSON.parse(savingsGoals),
        userPreferences: JSON.parse(userPreferences)
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'smartspend-backup.json';
      a.click();
      
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
      console.error(error);
    }
  };
  
  const handleImportData = async () => {
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }
    
    try {
      const fileContent = await importFile.text();
      const data = JSON.parse(fileContent);
      
      // Validate the imported data structure
      if (data.transactions && data.categories) {
        localStorage.setItem('transactions', JSON.stringify(data.transactions));
        localStorage.setItem('categories', JSON.stringify(data.categories));
        
        if (data.savingsGoals) {
          localStorage.setItem('savingsGoals', JSON.stringify(data.savingsGoals));
        }
        
        if (data.userPreferences) {
          localStorage.setItem('userPreferences', JSON.stringify(data.userPreferences));
          setPreferences(data.userPreferences);
          form.reset(data.userPreferences);
        }
        
        toast.success('Data imported successfully. Refresh the page to see changes.');
      } else {
        toast.error('Invalid data format');
      }
    } catch (error) {
      toast.error('Failed to import data. Make sure the file is valid JSON.');
      console.error(error);
    }
    
    setImportFile(null);
  };
  
  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem('transactions');
      localStorage.removeItem('categories');
      localStorage.removeItem('savingsGoals');
      toast.success('All data has been cleared. Refresh the page to see changes.');
    }
  };
  
  const savePreferences = (data: UserPreferences) => {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(data));
      setPreferences(data);
      toast.success('Preferences saved successfully');
    } catch (error) {
      toast.error('Failed to save preferences');
      console.error(error);
    }
  };
  
  const currencies = [
    { code: 'USD', label: 'US Dollar ($)' },
    { code: 'EUR', label: 'Euro (€)' },
    { code: 'GBP', label: 'British Pound (£)' },
    { code: 'JPY', label: 'Japanese Yen (¥)' },
    { code: 'CAD', label: 'Canadian Dollar (CA$)' },
  ];
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <SettingsIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Manage your application settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(savePreferences)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            {...field}
                          >
                            {currencies.map(currency => (
                              <option key={currency.code} value={currency.code}>
                                {currency.label}
                              </option>
                            ))}
                          </select>
                          <FormDescription>
                            Select your preferred currency for the app
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="weekStartsOn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Week Starts On</FormLabel>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            {...field}
                          >
                            <option value="monday">Monday</option>
                            <option value="sunday">Sunday</option>
                          </select>
                          <FormDescription>
                            Choose which day your week starts on
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="darkMode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Dark Mode</FormLabel>
                            <FormDescription>
                              Toggle dark mode on or off
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">Save Preferences</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(savePreferences)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="notifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable Notifications</FormLabel>
                            <FormDescription>
                              Receive updates about your budgets and goals
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className={!form.watch('notifications') ? 'opacity-50 pointer-events-none' : ''}>
                      <div className="rounded-lg border p-4 space-y-4">
                        <h3 className="font-medium">Notification Types</h3>
                        <FormItem className="flex flex-row items-center justify-between border-b pb-4">
                          <div className="space-y-0.5">
                            <FormLabel>Budget Alerts</FormLabel>
                            <FormDescription>
                              Get notified when you're close to your budget limit
                            </FormDescription>
                          </div>
                          <Switch defaultChecked />
                        </FormItem>
                        
                        <FormItem className="flex flex-row items-center justify-between border-b pb-4">
                          <div className="space-y-0.5">
                            <FormLabel>Goal Progress</FormLabel>
                            <FormDescription>
                              Notifications about your savings goal progress
                            </FormDescription>
                          </div>
                          <Switch defaultChecked />
                        </FormItem>
                        
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Weekly Reports</FormLabel>
                            <FormDescription>
                              Receive weekly spending reports
                            </FormDescription>
                          </div>
                          <Switch />
                        </FormItem>
                      </div>
                    </div>
                    
                    <Button type="submit">Save Notification Settings</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Export, import, or clear your budget data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col space-y-2">
                  <Button onClick={handleExportData} className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Save a backup of your transactions, budgets, and settings
                  </p>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="justify-start">
                        <CloudUpload className="mr-2 h-4 w-4" />
                        Import Data
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Import Data</SheetTitle>
                        <SheetDescription>
                          Upload a previously exported backup file to restore your data.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-6">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-accent/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <CloudUpload className="w-8 h-8 mb-3 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">.JSON file only</p>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept=".json" 
                              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                            />
                          </label>
                        </div>
                        {importFile && (
                          <div className="mt-4 p-2 bg-accent/20 rounded flex items-center justify-between">
                            <span className="text-sm truncate">{importFile.name}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setImportFile(null)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <SheetFooter>
                        <SheetClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </SheetClose>
                        <Button onClick={handleImportData} disabled={!importFile}>
                          Import
                        </Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                  <p className="text-xs text-muted-foreground">
                    Restore your data from a previous backup
                  </p>
                </div>
                
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Button 
                    variant="destructive" 
                    onClick={handleClearData}
                    className="justify-start"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All Data
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Warning: This will permanently delete all your data
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
